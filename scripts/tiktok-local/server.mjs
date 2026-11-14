import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ApiError, Keychain, TikTokClient, PORT, loadConfig, safeCode, sameSecret } from './api.mjs';
import { LocalState } from './storage.mjs';
import { receiveVideo } from './media.mjs';

const WEB = fileURLToPath(new URL('./web/', import.meta.url));
const ASSETS = new Map([['/', ['index.html', 'text/html']], ['/app.js', ['app.js', 'text/javascript']], ['/style.css', ['style.css', 'text/css']]]);

export function createCompanion({ client, state, receive = receiveVideo, ready = () => true }) {
  const sessions = new Map();
  let busy = false;
  let authorizing = false;
  let previewing = false;
  let windowStart = Date.now();
  let requests = 0;

  function json(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  }
  async function body(req) {
    if (req.headers['content-type'] !== 'application/json') throw new ApiError('json_required', 415);
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (Buffer.byteLength(raw) > 4096) throw new ApiError('request_too_large', 413);
    }
    try { return JSON.parse(raw); } catch { throw new ApiError('invalid_json'); }
  }
  function session(req, res, create = false) {
    const cookie = req.headers.cookie?.split(';').map(item => item.trim()).find(item => item.startsWith('aca_session='))?.slice(12);
    let current = sessions.get(cookie);
    if (current && current.expires <= Date.now()) { sessions.delete(cookie); current = null; }
    if (!current && create) {
      for (const [id, item] of sessions) if (item.expires <= Date.now()) sessions.delete(id);
      if (sessions.size >= 20) throw new ApiError('session_limit_restart_companion', 429);
      const id = crypto.randomBytes(32).toString('base64url');
      current = { csrf: crypto.randomBytes(32).toString('base64url'), expires: Date.now() + 8 * 3600000 };
      sessions.set(id, current);
      // HTTP is loopback-only; SameSite=Lax permits the registered HTTPS OAuth return.
      res.setHeader('Set-Cookie', 'aca_session=' + id + '; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800');
    }
    if (!current) throw new ApiError('open_companion_first', 401);
    return current;
  }

  const server = http.createServer({ maxHeaderSize: 8192 }, async (req, res) => {
    const host = '127.0.0.1:' + server.address().port;
    const origin = 'http://' + host;
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self'; img-src https:; media-src 'self' blob:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
    try {
      if (!ready()) throw new ApiError('companion_starting', 503);
      if (req.headers.host !== host) throw new ApiError('invalid_host', 403);
      if (req.headers.origin && req.headers.origin !== origin) throw new ApiError('invalid_origin', 403);
      const url = new URL(req.url, origin);
      if (url.origin !== origin || url.hash) throw new ApiError('invalid_request');
      if (Date.now() - windowStart > 60000) { windowStart = Date.now(); requests = 0; }
      if (++requests > 120) { res.setHeader('Retry-After', '60'); throw new ApiError('rate_limit', 429); }
      const asset = ASSETS.get(url.pathname);
      if (req.method === 'GET' && asset && !url.search) {
        if (url.pathname === '/') session(req, res, true);
        res.writeHead(200, { 'Content-Type': asset[1] + '; charset=utf-8' });
        res.end(await fs.readFile(path.join(WEB, asset[0])));
        return;
      }
      const current = session(req, res);
      if (url.pathname === '/oauth/callback' && req.method === 'GET') {
        const fields = ['state', 'code', 'error', 'scopes', 'error_description'];
        if (url.search.length > 4096 || [...url.searchParams.keys()].some(key => !fields.includes(key))
          || fields.some(key => url.searchParams.getAll(key).length > 1)
          || !current.oauthStarted) throw new ApiError('invalid_oauth_callback', 403);
        current.oauthStarted = false;
        try {
          if (busy || authorizing) throw new ApiError('operation_in_progress', 409);
          authorizing = true;
          try { await client.callback(Object.fromEntries(['state', 'code', 'error'].filter(key => url.searchParams.has(key)).map(key => [key, url.searchParams.get(key)]))); }
          finally { authorizing = false; }
          res.writeHead(303, { Location: '/' });
        } catch (error) {
          current.oauthError = safeCode(error.code, 'oauth_failed');
          res.writeHead(303, { Location: '/' });
        }
        res.end();
        return;
      }
      if (req.headers['sec-fetch-site'] && req.headers['sec-fetch-site'] !== 'same-origin') throw new ApiError('same_origin_required', 403);
      if (url.search) throw new ApiError('unexpected_query');
      if (req.method === 'POST' && (!sameSecret(req.headers['x-csrf-token'], current.csrf) || req.headers.origin !== origin)) {
        throw new ApiError('invalid_csrf', 403);
      }
      if (req.method === 'GET' && url.pathname === '/api/v1/status') {
        json(res, 200, { data: { ...client.summary(), csrf: current.csrf, busy, oauthError: current.oauthError || null, operations: state.publicOperations() } });
      } else if (req.method === 'POST' && url.pathname === '/api/v1/authorizations') {
        await body(req);
        if (busy || authorizing) throw new ApiError('operation_in_progress', 409);
        const authorizationUrl = client.begin();
        current.oauthStarted = true;
        current.oauthError = null;
        json(res, 201, { data: { authorizationUrl } });
      } else if (req.method === 'GET' && url.pathname === '/api/v1/profile') {
        json(res, 200, { data: await client.profile() });
      } else if (req.method === 'GET' && url.pathname === '/api/v1/videos') {
        json(res, 200, { data: await client.videos() });
      } else if (req.method === 'POST' && url.pathname === '/api/v1/media') {
        if (previewing || busy) throw new ApiError('operation_in_progress', 409);
        previewing = true;
        try { json(res, 201, { data: await receive(req, state) }); } finally { previewing = false; }
      } else if (req.method === 'POST' && url.pathname === '/api/v1/drafts') {
        const input = await body(req);
        if (busy || authorizing) throw new ApiError('operation_in_progress', 409);
        if (input.confirmDraft !== true || !/^[a-f0-9]{32}$/.test(input.mediaId || '')) throw new ApiError('preview_and_confirm_draft');
        const media = state.media.get(input.mediaId);
        if (!media) throw new ApiError('video_preview_expired', 409);
        busy = true;
        let operation;
        try {
          const token = await client.accessToken();
          const profile = await client.profile();
          if (profile.user?.username !== 'acaservice01') throw new ApiError('only_aca_profile_allowed', 403);
          operation = await state.reserve(media, token.open_id);
          await state.event({ action: 'draft_reserved', operationId: operation.id });
          await client.uploadDraft(media.file, media.size, changes => state.update(operation, changes));
          await state.event({ action: 'draft_transferred', operationId: operation.id });
          json(res, 201, { data: state.publicOperations().find(item => item.id === operation.id) });
        } catch (error) {
          if (operation) {
            await state.update(operation, { status: 'needs_review', error: safeCode(error.code, 'draft_failed_check_status') });
            await state.event({ action: 'draft_needs_review', operationId: operation.id, code: safeCode(error.code) });
          }
          throw error;
        } finally { busy = false; }
      } else if (req.method === 'POST' && /^\/api\/v1\/drafts\/[a-f0-9]{32}\/status$/.test(url.pathname)) {
        await body(req);
        const operation = state.operations.find(item => item.id === url.pathname.split('/')[4]);
        if (!operation?.publishId) throw new ApiError('no_publish_id_check_tiktok_inbox', 409);
        const result = await client.draftStatus(operation.publishId);
        const tiktokStatus = safeCode(result?.status, 'unknown');
        await state.update(operation, { tiktokStatus });
        json(res, 200, { data: { tiktokStatus } });
      } else throw new ApiError('not_found', 404);
    } catch (error) {
      if (!res.headersSent) json(res, error instanceof ApiError ? error.status : 500, {
        error: { code: safeCode(error.code, 'internal_error') },
      });
      else res.end();
    }
  });
  server.requestTimeout = 300000;
  server.headersTimeout = 10000;
  return server;
}

export async function start() {
  const config = await loadConfig();
  const state = new LocalState(path.join(os.homedir(), '.config/aca-api/tiktok', config.environment + '-local'));
  const client = new TikTokClient(config, new Keychain(config.app_id), { journal: entry => state.event(entry) });
  let ready = false;
  const server = createCompanion({ client, state, ready: () => ready });
  // Bind before clearing this process's old media, so a second launch cannot remove
  // previews belonging to an already running companion.
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(PORT, '127.0.0.1', resolve); });
  try { await state.init(); ready = true; }
  catch (error) { server.close(); throw error; }
  console.log('ACA TikTok: http://127.0.0.1:' + PORT + ' (' + config.environment + ')');
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  start().catch(error => { console.error('ACA TikTok: ' + safeCode(error.code, 'startup_failed')); process.exitCode = 1; });
}

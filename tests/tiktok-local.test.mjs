import assert from 'node:assert/strict';
import test from 'node:test';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { ApiError, TikTokClient, REDIRECT_URI, DESKTOP_REDIRECT_URI, SCOPES, loadConfig, uploadPlan, validateUploadUrl } from '../scripts/tiktok-local/api.mjs';
import { LocalState } from '../scripts/tiktok-local/storage.mjs';
import { inspectVideo } from '../scripts/tiktok-local/media.mjs';
import { createCompanion } from '../scripts/tiktok-local/server.mjs';
import { localCallback } from '../client/public/tiktok/callback/callback.js';

const config = { environment: 'sandbox', app_id: '7704346740707575816', redirect_uri: REDIRECT_URI, scopes: SCOPES,
  client_key_item: 'sandbox-client-key', client_secret_item: 'sandbox-client-secret', token_item: 'sandbox-grant' };
const now = 1800000000000;
function fixture(options = {}) {
  const values = new Map([['sandbox-client-key', 'test-key'], ['sandbox-client-secret', 'test-secret']]);
  const store = { read: key => values.get(key), write: (key, value) => values.set(key, value) };
  const client = new TikTokClient(config, store, { now: () => now, ...options });
  return { client, store };
}
function grant(overrides = {}) {
  return { access_token: 'test-access', refresh_token: 'test-refresh', open_id: 'test-account', scope: SCOPES.join(','),
    expires_at: now + 7200000, refresh_expires_at: now + 86400000, ...overrides };
}
function tokenResponse(overrides = {}) {
  return Response.json({ access_token: 'test-access-new', refresh_token: 'test-refresh-new', open_id: 'test-account',
    expires_in: 7200, refresh_expires_in: 86400, scope: SCOPES.join(','), ...overrides });
}

test('OAuth consumes state once, rejects wrong state, expiry and denial before exchange', async () => {
  let exchanges = 0;
  const { client, store } = fixture({ fetchImpl: async () => { exchanges++; return tokenResponse(); } });
  const url = new URL(client.begin()); const state = url.searchParams.get('state');
  assert.equal(url.origin, 'https://www.tiktok.com');
  assert.equal(url.searchParams.get('redirect_uri'), REDIRECT_URI);
  assert.equal(url.searchParams.get('scope'), SCOPES.join(','));
  await assert.rejects(client.callback({ code: 'test-code', state: 'wrong' }), { code: 'invalid_oauth_state' });
  const summary = await client.callback({ code: 'test-code', state });
  assert.equal(summary.connected, true);
  assert.equal(JSON.stringify(summary).includes('test-access'), false);
  assert.equal(JSON.parse(store.read('sandbox-grant')).refresh_token, 'test-refresh-new');
  await assert.rejects(client.callback({ code: 'test-code', state }), { code: 'invalid_oauth_state' });
  let pending = new URL(client.begin()).searchParams.get('state'); client.pending.expires = now - 1;
  await assert.rejects(client.callback({ code: 'test-code', state: pending }), { code: 'oauth_state_expired' });
  pending = new URL(client.begin()).searchParams.get('state');
  await assert.rejects(client.callback({ state: pending, error: 'access_denied' }), { code: 'oauth_denied' });
  assert.equal(exchanges, 1);
});

test('expired tokens refresh once for concurrent reads and persist rotated grant', async () => {
  let calls = 0;
  const { client, store } = fixture({ fetchImpl: async (_url, request) => {
    calls++; assert.equal(request.redirect, 'error'); assert.equal(request.body.get('grant_type'), 'refresh_token');
    await new Promise(resolve => setTimeout(resolve, 5)); return tokenResponse();
  } });
  store.write('sandbox-grant', JSON.stringify(grant({ expires_at: now - 1 })));
  const results = await Promise.all([client.accessToken(), client.accessToken(), client.accessToken()]);
  assert.equal(calls, 1); assert.equal(results[0].access_token, 'test-access-new');
  assert.equal(JSON.parse(store.read('sandbox-grant')).refresh_token, 'test-refresh-new');
});

test('Desktop OAuth binds code exchange to a one-use PKCE verifier kept off the browser URL', async () => {
  let posted;
  const { client } = fixture({ fetchImpl: async (_url, request) => { posted = request.body; return tokenResponse(); } });
  client.config = { ...config, oauth_mode: 'desktop', redirect_uri: DESKTOP_REDIRECT_URI };
  const first = new URL(client.begin()); const firstVerifier = client.pending.verifier;
  assert.match(firstVerifier, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(first.searchParams.get('code_challenge'), crypto.createHash('sha256').update(firstVerifier).digest('hex'));
  assert.equal(first.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(first.href.includes(firstVerifier), false);
  assert.equal(first.searchParams.get('redirect_uri'), DESKTOP_REDIRECT_URI);
  const second = new URL(client.begin()); const verifier = client.pending.verifier;
  assert.notEqual(verifier, firstVerifier);
  await assert.rejects(client.callback({ code: 'test-code', state: first.searchParams.get('state') }), { code: 'invalid_oauth_state' });
  await client.callback({ code: 'test-code', state: second.searchParams.get('state') });
  assert.equal(posted.get('code_verifier'), verifier); assert.equal(posted.get('redirect_uri'), DESKTOP_REDIRECT_URI);
  assert.equal(client.pending, null);
});

test('refresh account mismatch and upstream errors do not replace grant or leak response', async () => {
  const { client, store } = fixture({ fetchImpl: async () => tokenResponse({ open_id: 'other-account' }) });
  const saved = JSON.stringify(grant({ expires_at: now - 1 })); store.write('sandbox-grant', saved);
  await assert.rejects(client.accessToken(), { code: 'token_account_mismatch' }); assert.equal(store.read('sandbox-grant'), saved);
  client.fetch = async () => Response.json({ error: '<secret response>' }, { status: 400 });
  await assert.rejects(client.accessToken(), { code: 'tiktok_token_exchange_failed' });
});

test('profile requests only fields covered by granted scopes; videos require video.list', async () => {
  let requested;
  const { client, store } = fixture({ fetchImpl: async url => { requested = url; return Response.json({ error: { code: 'ok' }, data: { user: {} } }); } });
  store.write('sandbox-grant', JSON.stringify(grant({ scope: 'user.info.basic' })));
  await client.profile(); assert.equal(requested.includes('follower_count'), false); assert.equal(requested.includes('username'), false);
  await assert.rejects(client.videos(), { code: 'missing_scope_video_list' });
});

test('upload ranges obey TikTok chunk rules, signed URLs cannot redirect to arbitrary hosts', () => {
  for (const size of [1024, 5 * 1024 ** 2, 64 * 1024 ** 2, 65 * 1024 ** 2, 100 * 1024 ** 2, 128 * 1024 ** 2]) {
    const plan = uploadPlan(size); assert.equal(plan.count, Math.max(1, Math.floor(size / plan.chunkSize)));
    assert.equal(plan.chunks[0].start, 0); assert.equal(plan.chunks.at(-1).end, size - 1);
    for (let i = 1; i < plan.count; i++) assert.equal(plan.chunks[i].start, plan.chunks[i - 1].end + 1);
  }
  assert.throws(() => uploadPlan(129 * 1024 ** 2));
  for (const raw of ['http://open-upload.tiktokapis.com/x', 'https://open-upload.tiktokapis.com.evil.test/x', 'https://127.0.0.1/x', 'https://u:p@open-upload.tiktokapis.com/x']) assert.throws(() => validateUploadUrl(raw));
  assert.equal(validateUploadUrl('https://open-upload.tiktokapis.com/video/?signature=test'), 'https://open-upload.tiktokapis.com/video/?signature=test');
});

test('draft records publish ID before bytes; transfer URL contains no bearer token', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'aca-tiktok-test-'));
  const file = path.join(directory, 'test.mp4'); await fs.writeFile(file, Buffer.alloc(2048));
  const changes = []; let puts = 0;
  try {
    const { client, store } = fixture({ fetchImpl: async (url, request) => {
      if (url.includes('/inbox/video/init/')) return Response.json({ error: { code: 'ok' }, data: { publish_id: 'test-publish-id', upload_url: 'https://open-upload.tiktokapis.com/test' } });
      puts++; assert.equal(changes[0].status, 'initialized'); assert.equal(request.headers.Authorization, undefined);
      assert.equal(request.headers['Content-Range'], 'bytes 0-2047/2048'); assert.equal(request.redirect, 'error');
      return new Response(null, { status: 201 });
    } });
    store.write('sandbox-grant', JSON.stringify(grant()));
    await client.uploadDraft(file, 2048, async value => changes.push(value));
    assert.equal(puts, 1); assert.equal(changes[1].status, 'transferred');
  } finally { await fs.rm(directory, { recursive: true, force: true }); }
});

test('public callback drops extra data, refuses injected/repeated fields and fixes loopback destination', () => {
  const state = crypto.randomBytes(32).toString('base64url');
  const valid = REDIRECT_URI + '?state=' + state + '&code=test-code&scopes=user.info.basic';
  const local = new URL(localCallback(valid));
  assert.equal(local.origin, 'http://127.0.0.1:8789'); assert.equal(local.pathname, '/oauth/callback'); assert.equal(local.searchParams.has('scopes'), false);
  for (const url of [valid + '&code=second', valid + '&redirect_uri=https://evil.test', valid + '#fragment', REDIRECT_URI, valid.replace('test-code', 'bad%0Acode')]) assert.throws(() => localCallback(url));
});

test('saved Sandbox config cannot reuse production Keychain items', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'aca-tiktok-test-')); const file = path.join(directory, 'config.json');
  try {
    await fs.writeFile(file, JSON.stringify(config)); assert.equal((await loadConfig(file)).environment, 'sandbox');
    await fs.writeFile(file, JSON.stringify({ ...config, oauth_mode: 'desktop', redirect_uri: DESKTOP_REDIRECT_URI }));
    assert.equal((await loadConfig(file)).oauth_mode, 'desktop');
    for (const redirect_uri of [REDIRECT_URI, 'http://localhost:8789/oauth/callback', DESKTOP_REDIRECT_URI + '?next=evil']) {
      await fs.writeFile(file, JSON.stringify({ ...config, oauth_mode: 'desktop', redirect_uri }));
      await assert.rejects(loadConfig(file), { code: 'invalid_local_config' });
    }
    await fs.writeFile(file, JSON.stringify({ ...config, token_item: 'production-grant' }));
    await assert.rejects(loadConfig(file), { code: 'sandbox_keychain_isolation_required' });
  } finally { await fs.rm(directory, { recursive: true, force: true }); }
});

test('local server enforces Host, session, Origin, CSRF, one-use OAuth and duplicate draft protection across restarts', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'aca-tiktok-test-'));
  const state = await new LocalState(directory).init(); let uploads = 0;
  const client = {
    summary: () => ({ connected: true, credentialsReady: true, environment: 'sandbox' }),
    begin: () => 'https://www.tiktok.com/v2/auth/authorize/?state=test',
    callback: async input => { assert.deepEqual(input, { state: 'test', code: 'test' }); return {}; }, accessToken: async () => grant(),
    profile: async () => ({ user: { username: 'acaservice01' } }), videos: async () => ({ videos: [] }),
    uploadDraft: async (_file, _size, update) => { uploads++; await update({ status: 'initialized', publishId: 'test-id' }); throw new ApiError('video_transfer_network_error', 502); },
    draftStatus: async () => ({ status: 'SEND_TO_USER_INBOX' }),
  };
  const server = createCompanion({ client, state }); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  try {
    const badHostStatus = await new Promise((resolve, reject) => {
      const request = http.get(origin + '/', { headers: { Host: 'evil.test' } }, response => { response.resume(); resolve(response.statusCode); });
      request.on('error', reject);
    });
    assert.equal(badHostStatus, 403);
    let response;
    response = await fetch(origin + '/api/v1/status'); assert.equal(response.status, 401);
    response = await fetch(origin + '/'); const cookie = response.headers.get('set-cookie').split(';')[0];
    assert.match(response.headers.get('set-cookie'), /HttpOnly; SameSite=Lax/);
    response = await fetch(origin + '/api/v1/status', { headers: { Cookie: cookie } }); const { data } = await response.json();
    const headers = { Cookie: cookie, Origin: origin, 'X-CSRF-Token': data.csrf, 'Content-Type': 'application/json' };
    response = await fetch(origin + '/api/v1/authorizations', { method: 'POST', headers: { ...headers, Origin: 'https://evil.test' }, body: '{}' }); assert.equal(response.status, 403);
    response = await fetch(origin + '/api/v1/authorizations', { method: 'POST', headers: { ...headers, 'X-CSRF-Token': 'wrong' }, body: '{}' }); assert.equal(response.status, 403);
    response = await fetch(origin + '/api/v1/authorizations', { method: 'POST', headers, body: '{}' }); assert.equal(response.status, 201);
    response = await fetch(origin + '/oauth/callback?state=test&code=test&scopes=user.info.basic&error_description=ignored', { headers: { Cookie: cookie }, redirect: 'manual' }); assert.equal(response.status, 303); assert.equal(response.headers.get('location'), '/');
    response = await fetch(origin + '/oauth/callback?state=test&code=test', { headers: { Cookie: cookie } }); assert.equal(response.status, 403);
    const mediaId = 'a'.repeat(32); state.media.set(mediaId, { id: mediaId, file: '/test.mp4', size: 2048, sha256: 'b'.repeat(64) });
    const send = () => fetch(origin + '/api/v1/drafts', { method: 'POST', headers, body: JSON.stringify({ mediaId, confirmDraft: true }) });
    response = await send(); assert.equal(response.status, 502); assert.equal(state.operations[0].status, 'needs_review');
    response = await send(); assert.equal(response.status, 409); assert.equal(uploads, 1);
    response = await fetch(origin + '/api/v1/drafts/' + state.operations[0].id + '/status', { method: 'POST', headers, body: '{}' }); assert.equal(response.status, 200);
    assert.equal(state.operations[0].tiktokStatus, 'SEND_TO_USER_INBOX');
    const restarted = await new LocalState(directory).init();
    await assert.rejects(restarted.reserve(state.media.get(mediaId), grant().open_id), { code: 'draft_already_attempted_check_status' });
    const journal = await fs.readFile(path.join(directory, 'operations.json'), 'utf8'); assert.equal(journal.includes('test-access'), false);
    assert.equal((await fs.stat(path.join(directory, 'operations.json'))).mode & 0o777, 0o600);
  } finally { await new Promise(resolve => server.close(resolve)); await fs.rm(directory, { recursive: true, force: true }); }
});

test('invalid video is rejected by real ffprobe', async () => {
  await assert.rejects(inspectVideo('/nonexistent-aca-tiktok-video.mp4'));
});

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export const SCOPES = ['user.info.basic', 'user.info.profile', 'user.info.stats', 'video.list', 'video.upload'];
export const REDIRECT_URI = 'https://acahydraulic.kz/tiktok/callback/';
export const PORT = 8789;
const API = 'https://open.tiktokapis.com';

export class ApiError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.code = code;
    this.status = status;
  }
}

export function safeCode(value, fallback = 'tiktok_request_failed') {
  return typeof value === 'string' && /^[a-z0-9_.-]{1,100}$/i.test(value) ? value : fallback;
}

export function sameSecret(left, right) {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
}

export class Keychain {
  constructor(account, prefix = 'kz.acahydraulic.tiktok.') {
    if (!/^[a-z0-9:._-]{1,180}$/i.test(account)) throw new ApiError('invalid_keychain_account');
    this.account = account;
    this.prefix = prefix;
  }
  service(name) {
    if (!/^[a-z0-9._-]{1,120}$/i.test(name)) throw new ApiError('invalid_keychain_item');
    return this.prefix + name;
  }
  read(name) {
    if (process.platform !== 'darwin') throw new ApiError('macos_keychain_required', 503);
    const result = spawnSync('/usr/bin/security', [
      'find-generic-password', '-a', this.account, '-s', this.service(name), '-w',
    ], { encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024 });
    if (result.status !== 0) return null;
    return result.stdout.replace(/\r?\n$/, '');
  }
  write(name, value) {
    if (process.platform !== 'darwin') throw new ApiError('macos_keychain_required', 503);
    // The value goes to security's stdin as hex, never into a process argument.
    const command = 'add-generic-password -U -a ' + this.account + ' -s ' + this.service(name)
      + ' -X ' + Buffer.from(value, 'utf8').toString('hex') + '\n';
    spawnSync('/usr/bin/security', ['-i'], {
      input: command, encoding: 'utf8', timeout: 15000, maxBuffer: 1024 * 1024,
    });
    if (!sameSecret(this.read(name), value)) throw new ApiError('keychain_write_failed', 503);
  }
}

export async function loadConfig(file = path.join(os.homedir(), '.config/aca-api/tiktok/local-config.json')) {
  const config = JSON.parse(await fs.readFile(file, 'utf8'));
  if (!['sandbox', 'production'].includes(config.environment)
    || !/^\d{10,30}$/.test(config.app_id || '')
    || config.redirect_uri !== REDIRECT_URI) throw new ApiError('invalid_local_config', 503);
  if (!Array.isArray(config.scopes) || !config.scopes.length
    || config.scopes.some(scope => !SCOPES.includes(scope))) throw new ApiError('invalid_scopes', 503);
  for (const field of ['client_key_item', 'client_secret_item', 'token_item']) {
    if (!/^[a-z0-9._-]{1,120}$/i.test(config[field] || '')) throw new ApiError('invalid_keychain_item', 503);
  }
  // Keep the Sandbox grant distinct from Production credentials and tokens.
  if (config.environment === 'sandbox' && ['client_key_item', 'client_secret_item', 'token_item']
    .some(field => !config[field].startsWith('sandbox-'))) throw new ApiError('sandbox_keychain_isolation_required', 503);
  return config;
}

export function uploadPlan(size) {
  if (!Number.isSafeInteger(size) || size < 1024 || size > 128 * 1024 * 1024) {
    throw new ApiError('video_size_outside_app_limit', 413);
  }
  const chunkSize = size <= 64 * 1024 * 1024 ? size : 32 * 1024 * 1024;
  const count = Math.max(1, Math.floor(size / chunkSize));
  return {
    chunkSize, count,
    chunks: Array.from({ length: count }, (_, index) => ({
      start: index * chunkSize,
      end: index === count - 1 ? size - 1 : (index + 1) * chunkSize - 1,
    })),
  };
}

export function validateUploadUrl(raw) {
  let url;
  try { url = new URL(raw); } catch { throw new ApiError('invalid_tiktok_upload_url', 502); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port
    || !(url.hostname === 'open-upload.tiktokapis.com'
      || /^upload\.[a-z0-9-]+\.tiktokapis\.com$/.test(url.hostname))) {
    throw new ApiError('invalid_tiktok_upload_url', 502);
  }
  return url.href;
}

export class TikTokClient {
  constructor(config, store, { fetchImpl = fetch, now = () => Date.now(), journal = async () => {} } = {}) {
    this.config = config;
    this.store = store;
    this.fetch = fetchImpl;
    this.now = now;
    this.journal = journal;
    this.pending = null;
    this.refreshing = null;
  }
  credentials() {
    const key = this.store.read(this.config.client_key_item);
    const secret = this.store.read(this.config.client_secret_item);
    if (!key || !secret) throw new ApiError('credentials_not_saved', 503);
    return { key, secret };
  }
  token() {
    const raw = this.store.read(this.config.token_item);
    if (!raw) return null;
    try {
      const token = JSON.parse(raw);
      if (!['access_token', 'refresh_token', 'open_id', 'scope'].every(field => typeof token[field] === 'string' && token[field].length > 0 && token[field].length <= 8192)
        || !Number.isSafeInteger(token.expires_at) || !Number.isSafeInteger(token.refresh_expires_at)) throw new Error();
      return token;
    } catch { throw new ApiError('invalid_saved_token', 503); }
  }
  summary() {
    const token = this.token();
    return {
      environment: this.config.environment,
      appId: this.config.app_id,
      credentialsReady: Boolean(this.store.read(this.config.client_key_item) && this.store.read(this.config.client_secret_item)),
      connected: Boolean(token?.access_token && token.refresh_expires_at > this.now()),
      scopes: token?.scope?.split(',').filter(Boolean) || [],
      requestedScopes: this.config.scopes,
      accessExpiresAt: token?.expires_at || null,
      redirectUri: this.config.redirect_uri,
    };
  }
  begin() {
    const { key } = this.credentials();
    const state = crypto.randomBytes(32).toString('base64url');
    this.pending = { state, expires: this.now() + 10 * 60 * 1000 };
    const url = new URL('https://www.tiktok.com/v2/auth/authorize/');
    url.search = new URLSearchParams({
      client_key: key, response_type: 'code', scope: this.config.scopes.join(','),
      redirect_uri: this.config.redirect_uri, state, disable_auto_auth: '1',
    }).toString();
    return url.href;
  }
  async requestToken(params) {
    const { key, secret } = this.credentials();
    let response;
    try {
      response = await this.fetch(API + '/v2/oauth/token/', {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(20000),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cache-Control': 'no-cache' },
        body: new URLSearchParams({ client_key: key, client_secret: secret, ...params }),
      });
    } catch { throw new ApiError('tiktok_token_network_error', 502); }
    let token;
    try { token = await response.json(); } catch { throw new ApiError('tiktok_token_invalid_response', 502); }
    if (!response.ok || token.error || !['access_token', 'refresh_token', 'open_id', 'scope'].every(field =>
      typeof token[field] === 'string' && token[field].length > 0 && token[field].length <= 8192)
      || !Number.isFinite(token.expires_in) || token.expires_in <= 0 || token.expires_in > 86400000
      || !Number.isFinite(token.refresh_expires_in) || token.refresh_expires_in <= 0) {
      throw new ApiError(safeCode(token.error, 'tiktok_token_exchange_failed'), 502);
    }
    return {
      access_token: token.access_token, refresh_token: token.refresh_token, open_id: token.open_id,
      scope: String(token.scope || ''), expires_at: this.now() + token.expires_in * 1000,
      refresh_expires_at: this.now() + token.refresh_expires_in * 1000,
    };
  }
  async callback(params) {
    const pending = this.pending;
    if (!pending || !sameSecret(params.state, pending.state)) throw new ApiError('invalid_oauth_state', 403);
    this.pending = null; // Consume once, including denial and expired callbacks.
    if (pending.expires < this.now()) throw new ApiError('oauth_state_expired', 403);
    if (params.error) throw new ApiError('oauth_denied', 403);
    if (typeof params.code !== 'string' || params.code.length > 2048
      || !params.code || /[\r\n]/.test(params.code)) throw new ApiError('invalid_oauth_code');
    const token = await this.requestToken({
      grant_type: 'authorization_code', code: params.code, redirect_uri: this.config.redirect_uri,
    });
    this.store.write(this.config.token_item, JSON.stringify(token));
    await this.journal({ action: 'oauth_connected', environment: this.config.environment });
    return this.summary();
  }
  async accessToken() {
    const token = this.token();
    if (!token?.access_token) throw new ApiError('connect_tiktok_first', 401);
    if (token.expires_at > this.now() + 60000) return token;
    if (token.refresh_expires_at <= this.now()) throw new ApiError('tiktok_reauthorization_required', 401);
    if (!this.refreshing) {
      this.refreshing = (async () => {
        const refreshed = await this.requestToken({ grant_type: 'refresh_token', refresh_token: token.refresh_token });
        if (refreshed.open_id !== token.open_id) throw new ApiError('token_account_mismatch', 502);
        this.store.write(this.config.token_item, JSON.stringify(refreshed));
        await this.journal({ action: 'oauth_refreshed', environment: this.config.environment });
        return refreshed;
      })().finally(() => { this.refreshing = null; });
    }
    return this.refreshing;
  }
  async request(route, { method = 'GET', body, scope } = {}) {
    const token = await this.accessToken();
    if (scope && !token.scope.split(',').includes(scope)) throw new ApiError('missing_scope_' + scope.replaceAll('.', '_'), 403);
    let response;
    try {
      response = await this.fetch(API + route, {
        method, redirect: 'error', signal: AbortSignal.timeout(30000),
        headers: { Authorization: 'Bearer ' + token.access_token, 'Content-Type': 'application/json' },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    } catch { throw new ApiError('tiktok_network_error', 502); }
    let data;
    try { data = await response.json(); } catch { throw new ApiError('tiktok_invalid_response', 502); }
    if (!response.ok || data.error?.code !== 'ok') {
      throw new ApiError(safeCode(data.error?.code), response.status === 429 ? 429 : 502);
    }
    return data.data;
  }
  async profile() {
    const token = await this.accessToken();
    const fields = ['open_id', 'display_name', 'avatar_url'];
    const scopes = token.scope.split(',');
    if (scopes.includes('user.info.profile')) fields.push('username', 'profile_deep_link', 'bio_description', 'is_verified');
    if (scopes.includes('user.info.stats')) fields.push('follower_count', 'following_count', 'likes_count', 'video_count');
    return this.request('/v2/user/info/?fields=' + fields.join(','), { scope: 'user.info.basic' });
  }
  videos() {
    return this.request('/v2/video/list/?fields=id,title,create_time,share_url,cover_image_url,duration,view_count,like_count,comment_count,share_count', {
      method: 'POST', body: { max_count: 20 }, scope: 'video.list',
    });
  }
  async uploadDraft(file, size, update) {
    const plan = uploadPlan(size);
    const initialized = await this.request('/v2/post/publish/inbox/video/init/', {
      method: 'POST', scope: 'video.upload',
      body: { source_info: { source: 'FILE_UPLOAD', video_size: size, chunk_size: plan.chunkSize, total_chunk_count: plan.count } },
    });
    if (!initialized?.publish_id || typeof initialized.publish_id !== 'string' || initialized.publish_id.length > 300) {
      throw new ApiError('missing_tiktok_publish_id', 502);
    }
    // Record the external operation before transferring any bytes. Do not persist its signed upload URL.
    await update({ status: 'initialized', publishId: initialized.publish_id });
    const uploadUrl = validateUploadUrl(initialized.upload_url);
    const handle = await fs.open(file, 'r');
    try {
      for (const chunk of plan.chunks) {
        const length = chunk.end - chunk.start + 1;
        const buffer = Buffer.alloc(length);
        let filled = 0;
        while (filled < length) {
          const { bytesRead } = await handle.read(buffer, filled, length - filled, chunk.start + filled);
          if (!bytesRead) throw new ApiError('video_file_changed', 409);
          filled += bytesRead;
        }
        let response;
        try {
          response = await this.fetch(uploadUrl, {
            method: 'PUT', redirect: 'error', signal: AbortSignal.timeout(120000),
            headers: {
              'Content-Type': 'video/mp4', 'Content-Length': String(length),
              'Content-Range': 'bytes ' + chunk.start + '-' + chunk.end + '/' + size,
            },
            body: buffer,
          });
        } catch { throw new ApiError('video_transfer_network_error', 502); }
        if (![200, 201, 206].includes(response.status)) throw new ApiError('video_transfer_rejected', 502);
        await response.body?.cancel();
      }
    } finally { await handle.close(); }
    await update({ status: 'transferred', publishId: initialized.publish_id });
    return initialized.publish_id;
  }
  draftStatus(publishId) {
    return this.request('/v2/post/publish/status/fetch/', {
      method: 'POST', body: { publish_id: publishId }, scope: 'video.upload',
    });
  }
}

# ACA TikTok on Mac

Local companion for the owner of `@acaservice01`: Login Kit, profile/video statistics and **draft uploads**. There is no Direct Post, advertising control, payment, or scheduled publishing endpoint.

## Install and start

Requires macOS, Node 22+ and existing `/opt/homebrew/bin/ffprobe`. No npm install is needed.

```sh
node scripts/tiktok-local/install.mjs
node "$HOME/Library/Application Support/ACA Hydraulic/TikTok/server.mjs"
```

Open `http://127.0.0.1:8789/` in Safari on the same Mac. The local session expires after eight hours. Stop with Control-C. The installer also saves `~/.config/aca-api/tiktok/ACA TikTok.command`. It does not create a background service.

`~/.config/aca-api/tiktok/local-config.json` contains only nonsecret item references. Sandbox app `ACA Hydraulic Mac Test v2` (`7704724301157304327`) uses its own Keychain account and these services:

- `kz.acahydraulic.tiktok.sandbox-client-key`
- `kz.acahydraulic.tiktok.sandbox-client-secret`
- `kz.acahydraulic.tiktok.sandbox-grant`

Credentials and rotated OAuth grants are stored only in macOS Keychain. Production app `7704330761684748296` remains separate. Never put secrets in repository files, browser storage, process arguments, screenshots or logs.

## OAuth and uploads

The installer defaults to the current registered Web flow. Existing local configuration is preserved. To enable the optional Desktop flow, first enable the Desktop platform in TikTok and register the exact Desktop redirect `http://127.0.0.1:8789/oauth/callback`. Then set `oauth_mode` to `desktop` and `redirect_uri` to that URI in local-config.json. The Desktop flow uses a fresh cryptographic PKCE verifier for each login; its SHA-256 hex challenge follows TikTok's Desktop specification. Only the one-use code exchange sends the verifier to TikTok. It never appears in browser URLs, frontend responses or logs. This flow returns directly to the running Mac companion and does not require public callback hosting.

Legacy Web mode remains available with `oauth_mode: web` and the exact Web redirect `https://acahydraulic.kz/tiktok/callback/`. Its static bridge has no analytics or third-party scripts; it strips the query from browser history and forwards code/state to the fixed loopback callback. Client Secret and tokens never pass through public JavaScript. The Mac must be running and the same browser session must have initiated login. Denial, expired state and replay are rejected. Partial scope grants are displayed; API fields are requested according to granted scopes.

Select an owned MP4 in the local panel, watch the preview, and explicitly confirm a draft upload. The companion validates size, container, codec, duration and dimensions with ffprobe, retains at least 15 GiB free disk, and allows at most three temporary video copies per run. Original files are never altered. Its copies are removed on restart.

Uploads are limited to `@acaservice01`, 128 MiB, MP4 H.264/HEVC, 3–600 seconds, 360–4096 pixels. Only TikTok's FILE_UPLOAD endpoint is used. Signed upload URLs must match TikTok's allowlist and redirects are disabled. Chunks are sequential. Open TikTok's inbox after transfer and finish editing/publication there. API transfer success is not proof that TikTok finished processing or published a video.

An operation is durably reserved before any external upload initialization. SHA-256 plus the authorized account prevents duplicate submission, including after a restart or ambiguous network failure. A failure does not retry initialization. Check the stored publish ID status and TikTok inbox before deciding whether another attempt is appropriate. The panel intentionally offers no automatic retry or delete-history control.

The private `sandbox-local/` directory contains a token-free operation journal and minimal event log (mode 0600). It excludes authorization codes, tokens, signed URLs and original file names. It records transfer/status evidence, not sales or ad performance. Keep the Mac account protected. No listener is exposed to the LAN, no CORS is enabled; Host, Origin, session and CSRF are checked.

## Verification

```sh
node --test tests/tiktok-local.test.mjs
```

Mocked tests do not prove TikTok approval or live integration. Before review, complete real Sandbox OAuth, verify the returned owned profile/video statistics, transfer one real draft, read back its processing status, and record the actual user flow. Never submit a fabricated demonstration. Business/Marketing API approval is separate from Login Kit and Content Posting API.

Official references: [Desktop Login and PKCE](https://developers.tiktok.com/doc/login-kit-desktop/), [Web Login](https://developers.tiktok.com/doc/login-kit-web/), [Sandbox](https://developers.tiktok.com/doc/add-a-sandbox/), [Video Upload](https://developers.tiktok.com/doc/content-posting-api-reference-upload-video/), [Media Transfer](https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide/).

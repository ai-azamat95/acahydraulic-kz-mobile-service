import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REDIRECT_URI, SCOPES } from './api.mjs';

if (process.platform !== 'darwin') throw new Error('macOS required');
const source = path.dirname(fileURLToPath(import.meta.url));
const destination = path.join(os.homedir(), 'Library/Application Support/ACA Hydraulic/TikTok');
const settings = path.join(os.homedir(), '.config/aca-api/tiktok');
await fs.mkdir(destination, { recursive: true, mode: 0o700 });
await fs.mkdir(path.join(destination, 'web'), { recursive: true, mode: 0o700 });
await fs.mkdir(settings, { recursive: true, mode: 0o700 });
for (const name of ['api.mjs', 'server.mjs', 'storage.mjs', 'media.mjs', 'README.md', 'web/index.html', 'web/app.js', 'web/style.css']) {
  await fs.copyFile(path.join(source, name), path.join(destination, name));
  await fs.chmod(path.join(destination, name), 0o600);
}
const config = {
  environment: 'sandbox', app_id: '7704346740707575816', redirect_uri: REDIRECT_URI, scopes: SCOPES,
  client_key_item: 'sandbox-client-key', client_secret_item: 'sandbox-client-secret', token_item: 'sandbox-grant',
};
try { await fs.writeFile(path.join(settings, 'local-config.json'), JSON.stringify(config, null, 2) + '\n', { flag: 'wx', mode: 0o600 }); }
catch (error) { if (error.code !== 'EEXIST') throw error; }
const quote = text => "'" + text.replaceAll("'", "'\\''") + "'";
const launcher = path.join(settings, 'ACA TikTok.command');
await fs.writeFile(launcher, '#!/bin/zsh\nexec ' + quote(process.execPath) + ' ' + quote(path.join(destination, 'server.mjs')) + '\n', { mode: 0o700 });
await fs.chmod(launcher, 0o700);
console.log('Installed: ' + destination + '\nLauncher: ' + launcher);

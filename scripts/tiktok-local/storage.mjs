import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ApiError } from './api.mjs';

export async function atomicJson(file, value) {
  const temporary = file + '.' + crypto.randomBytes(8).toString('hex') + '.tmp';
  try {
    const handle = await fs.open(temporary, 'wx', 0o600);
    try { await handle.writeFile(JSON.stringify(value, null, 2) + '\n'); await handle.sync(); }
    finally { await handle.close(); }
    await fs.rename(temporary, file);
  } finally { await fs.rm(temporary, { force: true }); }
}

export class LocalState {
  constructor(directory) {
    this.directory = directory;
    this.mediaDirectory = path.join(directory, 'media');
    this.operations = [];
    this.media = new Map();
    this.writes = Promise.resolve();
  }
  async init() {
    await fs.mkdir(this.directory, { recursive: true, mode: 0o700 });
    await fs.chmod(this.directory, 0o700);
    await fs.mkdir(this.mediaDirectory, { mode: 0o700, recursive: true });
    await fs.chmod(this.mediaDirectory, 0o700);
    try {
      this.operations = JSON.parse(await fs.readFile(path.join(this.directory, 'operations.json'), 'utf8'));
      if (!Array.isArray(this.operations) || this.operations.length > 100) throw new Error();
    } catch (error) {
      if (error.code !== 'ENOENT') throw new ApiError('invalid_operations_journal', 503);
    }
    // Files are copies owned by this companion, never the user's originals.
    for (const name of await fs.readdir(this.mediaDirectory)) {
      if (!/^[a-f0-9]{32}\.mp4$/.test(name)) continue;
      const file = path.join(this.mediaDirectory, name);
      if ((await fs.lstat(file)).isFile()) await fs.rm(file);
    }
    return this;
  }
  async event(entry) {
    const safe = { at: new Date().toISOString() };
    for (const name of ['action', 'environment', 'operationId', 'status', 'code']) {
      if (typeof entry[name] === 'string' && /^[a-z0-9_.-]{1,100}$/i.test(entry[name])) safe[name] = entry[name];
    }
    await fs.appendFile(path.join(this.directory, 'events.ndjson'), JSON.stringify(safe) + '\n', { mode: 0o600 });
  }
  publicOperations() {
    return this.operations.map(({ id, status, publishId, createdAt, error, tiktokStatus }) =>
      ({ id, status, publishId, createdAt, error, tiktokStatus }));
  }
  async reserve(media, openId) {
    const fingerprint = crypto.createHash('sha256').update(openId + ':' + media.sha256).digest('hex');
    if (this.operations.some(entry => entry.fingerprint === fingerprint)) throw new ApiError('draft_already_attempted_check_status', 409);
    if (this.operations.length >= 100) throw new ApiError('operation_journal_limit', 409);
    const operation = {
      id: crypto.randomBytes(16).toString('hex'), fingerprint, status: 'reserved',
      createdAt: new Date().toISOString(),
    };
    this.operations.push(operation);
    try { await this.persist(); }
    catch (error) { this.operations.pop(); throw error; }
    return operation;
  }
  persist() {
    const value = JSON.parse(JSON.stringify(this.operations));
    const next = this.writes.then(() => atomicJson(path.join(this.directory, 'operations.json'), value));
    this.writes = next.catch(() => {});
    return next;
  }
  async update(operation, changes) { Object.assign(operation, changes); await this.persist(); }
}

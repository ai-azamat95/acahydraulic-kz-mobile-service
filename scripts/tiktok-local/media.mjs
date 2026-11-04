import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { ApiError, uploadPlan } from './api.mjs';

export function inspectVideo(file, executable = '/opt/homebrew/bin/ffprobe') {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, ['-v', 'error', '-protocol_whitelist', 'file', '-show_entries',
      'format=duration,format_name:stream=codec_type,codec_name,width,height', '-of', 'json', file],
    { stdio: ['ignore', 'pipe', 'ignore'], timeout: 15000 });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; if (output.length > 32768) child.kill(); });
    child.on('error', () => reject(new ApiError('ffprobe_unavailable', 503)));
    child.on('close', code => {
      try {
        if (code !== 0) throw new Error();
        const data = JSON.parse(output);
        const video = data.streams?.find(stream => stream.codec_type === 'video');
        const duration = Number(data.format?.duration);
        if (!video || !['h264', 'hevc'].includes(video.codec_name)
          || !Number.isFinite(duration) || duration < 3 || duration > 600
          || video.width < 360 || video.width > 4096 || video.height < 360 || video.height > 4096
          || !data.format?.format_name?.split(',').includes('mp4')) throw new Error();
        resolve({ duration, width: video.width, height: video.height, codec: video.codec_name });
      } catch { reject(new ApiError('unsupported_video_use_mp4_h264_3_to_600_seconds', 422)); }
    });
  });
}

export async function receiveVideo(request, state, probe = inspectVideo) {
  if (request.headers['content-type'] !== 'video/mp4') throw new ApiError('mp4_required', 415);
  const expected = Number(request.headers['content-length']);
  uploadPlan(expected);
  if (state.media.size >= 3) throw new ApiError('restart_to_clear_video_previews', 409);
  const disk = await fs.statfs(state.mediaDirectory);
  if (disk.bavail * disk.bsize - expected < 15 * 1024 ** 3) throw new ApiError('need_15_gib_free_disk_space', 507);
  const id = crypto.randomBytes(16).toString('hex');
  const file = path.join(state.mediaDirectory, id + '.mp4');
  const handle = await fs.open(file, 'wx', 0o600);
  const hash = crypto.createHash('sha256');
  let size = 0;
  let header = Buffer.alloc(0);
  try {
    for await (const chunk of request) {
      size += chunk.length;
      if (size > expected) throw new ApiError('video_size_mismatch', 413);
      if (header.length < 12) header = Buffer.concat([header, chunk]).subarray(0, 12);
      hash.update(chunk);
      await handle.writeFile(chunk);
    }
    if (size !== expected || header.subarray(4, 8).toString('ascii') !== 'ftyp') throw new ApiError('invalid_mp4', 422);
    await handle.close();
    const details = await probe(file);
    const media = { id, file, size, sha256: hash.digest('hex'), ...details };
    state.media.set(id, media);
    return { id, size, ...details };
  } catch (error) {
    await handle.close().catch(() => {});
    await fs.rm(file, { force: true });
    throw error;
  }
}

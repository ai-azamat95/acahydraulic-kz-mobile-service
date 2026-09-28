import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const auditPath = path.resolve(process.argv[2] || 'catalog-image-text-audit.json');
const manifestPath = path.resolve(process.argv[3] || 'client/public/catalog-data/catalog-image-manifest.json');
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const manifestBody = fs.readFileSync(manifestPath);
const manifest = JSON.parse(manifestBody);
const manifestSha256 = crypto.createHash('sha256').update(manifestBody).digest('hex');

assert.equal(audit.imageCount, manifest.imageCount, 'image text audit must cover the current image count');
assert.equal(audit.forbiddenTextMatches, 0, 'image text audit must have zero forbidden-text matches');
assert.equal(audit.decodeFailures, 0, 'image text audit must have zero decode failures');
assert.equal(audit.manifestSha256, manifestSha256, 'image text audit is stale for the current integrity manifest');

console.log(JSON.stringify({ passed: true, imageCount: audit.imageCount, manifestSha256 }, null, 2));

import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { join } from 'node:path';

// CRC-32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const toCrc = buf.subarray(4, 8 + len);
  buf.writeUInt32BE(crc32(toCrc), 8 + len);
  return buf;
}

function generateIcon(size) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc((1 + width * 4) * height);

  // Brand gradient: Aurora #6D5BFF (109, 91, 255) to #00D4FF (0, 212, 255)
  // Accent indicator: #FFD166 (255, 209, 102)
  const radius = size * 0.22;
  const barWidth = Math.max(2, Math.round(size * 0.25));
  const barXStart = Math.round((size - barWidth) / 2);
  const barXEnd = barXStart + barWidth;
  const barYStart = Math.round(size * 0.15);
  const barYEnd = Math.round(size * 0.85);

  let pos = 0;
  for (let y = 0; y < height; y++) {
    rawData[pos++] = 0; // Filter: None
    const t = y / height;
    const r = Math.round(109 * (1 - t) + 0 * t);
    const g = Math.round(91 * (1 - t) + 212 * t);
    const b = Math.round(255 * (1 - t) + 255 * t);

    for (let x = 0; x < width; x++) {
      // Background rounded square
      const dx = Math.max(0, Math.abs(x - (size - 1) / 2) - ((size - 1) / 2 - radius));
      const dy = Math.max(0, Math.abs(y - (size - 1) / 2) - ((size - 1) / 2 - radius));
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > radius) {
        // Outside rounded rect
        rawData[pos++] = 0;
        rawData[pos++] = 0;
        rawData[pos++] = 0;
        rawData[pos++] = 0;
      } else {
        // Inside icon
        const isBar = x >= barXStart && x < barXEnd && y >= barYStart && y < barYEnd;
        if (isBar) {
          // Glow / progress bar in icon
          rawData[pos++] = 255;
          rawData[pos++] = 255;
          rawData[pos++] = 255;
          rawData[pos++] = 255;
        } else {
          rawData[pos++] = r;
          rawData[pos++] = g;
          rawData[pos++] = b;
          rawData[pos++] = 255;
        }
      }
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const idat = deflateSync(rawData);

  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    createChunk('IHDR', ihdr),
    createChunk('IDAT', idat),
    createChunk('IEND', Buffer.alloc(0)),
  ]);

  return png;
}

const outDir = join(process.cwd(), 'public', 'icons');
mkdirSync(outDir, { recursive: true });

for (const size of [16, 32, 48, 128]) {
  const icon = generateIcon(size);
  writeFileSync(join(outDir, `icon${size}.png`), icon);
  console.log(`Generated icon${size}.png (${icon.length} bytes)`);
}

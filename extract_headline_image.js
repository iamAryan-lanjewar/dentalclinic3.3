const fs = require('fs');
const zlib = require('zlib');

const str = fs.readFileSync('C:\\Users\\VICTUS\\.gemini\\antigravity\\brain\\511e0f4f-0d6e-45b0-9332-a8b31ed16397\\.user_uploaded\\media_1793267305208_78507455.pdf').toString('latin1');

function getStream(objNum) {
  const regex = new RegExp(`\\b${objNum}\\s+0\\s+obj\\s*<<[\\s\\S]*?>>\\s*stream\\r?\\n([\\s\\S]*?)\\r?\\nendstream`, 'g');
  const m = regex.exec(str);
  if (m) {
    try {
      return zlib.inflateSync(Buffer.from(m[1], 'latin1'));
    } catch (e) {
      return Buffer.from(m[1], 'latin1');
    }
  }
  return null;
}

const rgb = getStream(370);
const alpha = getStream(427);

console.log('RGB length:', rgb ? rgb.length : 0);
console.log('Alpha length:', alpha ? alpha.length : 0);
const width = 1661;
const height = 1242;
console.log('Expected RGB:', width * height * 3);
console.log('Expected Alpha:', width * height);

if (alpha && alpha.length === width * height) {
  // Let's create an RGBA buffer where RGB is white (#ffffff) or taken from rgb, and alpha from 427!
  // In BMP 32-bit: BGRA
  const rowSize = width * 4;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize;
  const header = Buffer.alloc(54);
  header.write('BM', 0);
  header.writeUInt32LE(fileSize, 2);
  header.writeUInt32LE(54, 10);
  header.writeUInt32LE(40, 14);
  header.writeInt32LE(width, 18);
  header.writeInt32LE(-height, 22); // top-down
  header.writeUInt16LE(1, 26);
  header.writeUInt16LE(32, 28); // 32 bpp
  header.writeUInt32LE(0, 30); // BI_RGB
  header.writeUInt32LE(pixelArraySize, 34);

  const outBuf = Buffer.alloc(fileSize);
  header.copy(outBuf, 0);

  let outIdx = 54;
  for (let i = 0; i < width * height; i++) {
    const a = alpha[i];
    // Color is white #ffffff
    outBuf[outIdx++] = 255; // B
    outBuf[outIdx++] = 255; // G
    outBuf[outIdx++] = 255; // R
    outBuf[outIdx++] = a;   // A
  }

  fs.writeFileSync('D:\\dentalclinic2.0\\headline_rgba.bmp', outBuf);
  console.log('Saved headline_rgba.bmp!');
}

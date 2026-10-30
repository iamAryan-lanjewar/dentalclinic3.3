const fs = require('fs');

function pdfToSvgPaths(blockStr) {
  const lines = blockStr.split('\n').map(l => l.trim()).filter(Boolean);
  let currentColor = '#000000';
  let paths = [];
  let currentD = [];
  
  for (let line of lines) {
    const tokens = line.split(/\s+/);
    const op = tokens[tokens.length - 1];
    
    if (op === 'RG' || op === 'rg') {
      if (tokens.length >= 4) {
        const r = Math.round(parseFloat(tokens[0]) * 255);
        const g = Math.round(parseFloat(tokens[1]) * 255);
        const b = Math.round(parseFloat(tokens[2]) * 255);
        // Map to hex for cleaner SVG
        const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        currentColor = hex;
      }
    } else if (op === 'm' && tokens.length === 3) {
      currentD.push(`M ${parseFloat(tokens[0])} ${parseFloat(tokens[1])}`);
    } else if (op === 'l' && tokens.length === 3) {
      currentD.push(`L ${parseFloat(tokens[0])} ${parseFloat(tokens[1])}`);
    } else if (op === 'c' && tokens.length === 7) {
      currentD.push(`C ${parseFloat(tokens[0])} ${parseFloat(tokens[1])}, ${parseFloat(tokens[2])} ${parseFloat(tokens[3])}, ${parseFloat(tokens[4])} ${parseFloat(tokens[5])}`);
    } else if (op === 'h') {
      currentD.push('Z');
    } else if (op === 'f') {
      if (currentD.length > 0) {
        paths.push({ d: currentD.join(' '), fill: currentColor });
        currentD = [];
      }
    }
  }
  return paths;
}

const b6 = pdfToSvgPaths(fs.readFileSync('block6.txt', 'utf8'));
const b4 = pdfToSvgPaths(fs.readFileSync('block4.txt', 'utf8'));
const b8 = pdfToSvgPaths(fs.readFileSync('block8.txt', 'utf8'));

function getBBox(paths) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of paths) {
    // Match all numbers
    const numbers = p.d.match(/-?\d+(\.\d+)?/g);
    if (!numbers) continue;
    for (let i = 0; i < numbers.length; i += 2) {
      const x = parseFloat(numbers[i]);
      const y = parseFloat(numbers[i+1]);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

const icons = {
  cross: b6,
  tooth: b4,
  heart: b8
};

for (const [name, paths] of Object.entries(icons)) {
  const bbox = getBBox(paths);
  console.log(name, bbox);
  
  // Make viewBox square or snug with slight padding
  // Let's compute a nice centered square viewBox so all 3 icons scale consistently!
  const maxDim = Math.max(bbox.width, bbox.height);
  const cx = bbox.minX + bbox.width / 2;
  const cy = bbox.minY + bbox.height / 2;
  const pad = maxDim * 0.05; // 5% padding
  const size = maxDim + pad * 2;
  const vbX = Math.round(cx - size / 2);
  const vbY = Math.round(cy - size / 2);
  const vbW = Math.round(size);
  const vbH = Math.round(size);
  
  let svgContent = `<svg viewBox="${vbX} ${vbY} ${vbW} ${vbH}" fill="none" xmlns="http://www.w3.org/2000/svg">\n`;
  for (const p of paths) {
    svgContent += `  <path d="${p.d}" fill="${p.fill}" />\n`;
  }
  svgContent += `</svg>\n`;
  
  fs.writeFileSync(`public/images/icon-${name}.svg`, svgContent);
  console.log(`Generated public/images/icon-${name}.svg (viewBox: ${vbX} ${vbY} ${vbW} ${vbH})`);
}

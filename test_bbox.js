const fs = require('fs');

const data = JSON.parse(fs.readFileSync('test_svgs.json', 'utf8'));

function getBBox(paths) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of paths) {
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

let previewHtml = `<!DOCTYPE html>
<html>
<head>
<title>Icon Preview</title>
<style>
body { font-family: sans-serif; display: flex; gap: 40px; padding: 50px; background: #e0f2f1; }
.card { background: white; padding: 20px; border-radius: 12px; text-align: center; }
svg { width: 80px; height: 80px; display: block; margin: 0 auto; }
</style>
</head>
<body>
`;

for (const [name, paths] of Object.entries(data)) {
  const bbox = getBBox(paths);
  console.log(name, bbox);
  
  // Pad viewBox slightly
  const pad = 10;
  const vbX = bbox.minX - pad;
  const vbY = bbox.minY - pad;
  const vbW = bbox.width + pad * 2;
  const vbH = bbox.height + pad * 2;
  
  let svgContent = `<svg viewBox="${vbX} ${vbY} ${vbW} ${vbH}" xmlns="http://www.w3.org/2000/svg">\n`;
  for (const p of paths) {
    svgContent += `  <path d="${p.d}" fill="${p.fill}" />\n`;
  }
  svgContent += `</svg>`;
  
  fs.writeFileSync(`public/images/icon-${name}.svg`, svgContent);
  
  previewHtml += `
  <div class="card">
    <h3>${name}</h3>
    ${svgContent}
  </div>`;
}

previewHtml += `</body></html>`;
fs.writeFileSync('public/icon_preview.html', previewHtml);
console.log('Saved icons and public/icon_preview.html');


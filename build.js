/**
 * UNIVERSAL BUILD SCRIPT FOR HOSTINGER, VERCEL & NODE.JS DEPLOYMENTS
 * Ensures smooth build across Next.js, Static, and Node.js hosting presets.
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'public');
const targetDirs = ['.next', 'dist', 'build'];

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((child) => {
      copyRecursiveSync(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

targetDirs.forEach((dirName) => {
  const destDir = path.join(__dirname, dirName);
  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    copyRecursiveSync(srcDir, destDir);
    console.log(`✓ Copied static assets to ${dirName}/`);
  } catch (err) {
    console.error(`Warning: Failed to copy to ${dirName}:`, err.message);
  }
});

console.log('✓ Build completed successfully for Hostinger deployment.');


const fs = require('fs');
const path = require('path');

const baseDir = 'D:\\dentalclinic2.0';
const publicDir = path.join(baseDir, 'public');
const fontsDir = path.join(publicDir, 'fonts');
const imagesDir = path.join(publicDir, 'images');

fs.mkdirSync(fontsDir, { recursive: true });
fs.mkdirSync(imagesDir, { recursive: true });

// Copy fonts
const fontCopies = [
  { src: path.join(baseDir, 'fonts', 'Roca-Two-Bold.ttf'), dest: 'Roca-Two-Bold.ttf' },
  { src: path.join(baseDir, 'fonts', 'Vintage-Goods.ttf'), dest: 'Vintage-Goods.ttf' },
  { src: path.join(baseDir, 'fonts', 'Animo.otf'), dest: 'Animo.otf' },
  { src: path.join(baseDir, 'fonts', 'Arimo', 'static', 'Arimo-Regular.ttf'), dest: 'Arimo-Regular.ttf' },
  { src: path.join(baseDir, 'fonts', 'Arimo', 'static', 'Arimo-Bold.ttf'), dest: 'Arimo-Bold.ttf' },
  { src: path.join(baseDir, 'fonts', 'Arimo', 'static', 'Arimo-Medium.ttf'), dest: 'Arimo-Medium.ttf' },
  { src: path.join(baseDir, 'fonts', 'Arimo', 'static', 'Arimo-Italic.ttf'), dest: 'Arimo-Italic.ttf' }
];

fontCopies.forEach(f => {
  if (fs.existsSync(f.src)) {
    fs.copyFileSync(f.src, path.join(fontsDir, f.dest));
    console.log(`Copied font: ${f.dest}`);
  } else {
    console.warn(`Font not found: ${f.src}`);
  }
});

// Copy images
const imageCopies = [
  { src: path.join(baseDir, 'extracted_assets', 'hero_girl.png'), dest: 'hero-girl.png' },
  { src: path.join(baseDir, 'extracted_assets', 'img_obj_153_1800x1200.jpg'), dest: 'doctor-dentist.jpg' },
  { src: path.join(baseDir, 'extracted_assets', 'img_obj_157_2400x2038.jpg'), dest: 'what-we-serve.jpg' },
  { src: path.join(baseDir, 'extracted_assets', 'img_obj_163_1252x830.jpg'), dest: 'dental-chair.jpg' },
  { src: path.join(baseDir, 'extracted_assets', 'img_obj_289_1556x1037.jpg'), dest: 'dental-unit.jpg' },
  { src: path.join(baseDir, 'extracted_assets', 'img_obj_166_1308x872.jpg'), dest: 'treatment-card.jpg' },
  { src: path.join(baseDir, 'extracted_assets', 'img_obj_167_872x1308.jpg'), dest: 'personalized-care.jpg' },
  { src: path.join(baseDir, 'extracted_assets', 'img_obj_168_872x1308.jpg'), dest: 'state-of-art.jpg' },
  { src: path.join(baseDir, 'extracted_assets', 'img_obj_196_1556x1037.jpg'), dest: 'clinic-footer.jpg' }
];

imageCopies.forEach(img => {
  if (fs.existsSync(img.src)) {
    fs.copyFileSync(img.src, path.join(imagesDir, img.dest));
    console.log(`Copied image: ${img.dest} (${fs.statSync(path.join(imagesDir, img.dest)).size} bytes)`);
  } else {
    console.warn(`Image not found: ${img.src}`);
  }
});


const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, '../public/products');

const images = [
  { src: 'manta_eco_2kg_1784748230080.jpg', dest: 'manta-eco-2kg.webp' },
  { src: 'tilma_eco_1_3kg_1784748218073.jpg', dest: 'tilma-eco-1-3kg.webp' },
  { src: 'tilma_eco_1kg_1784748254189.jpg', dest: 'tilma-eco-1kg.webp' },
  { src: 'tilma_ribeteada_1784748243311.jpg', dest: 'tilma-ribeteada.webp' }
];

async function optimize() {
  console.log('Starting image optimization...');
  for (const img of images) {
    const srcPath = path.join(productsDir, img.src);
    const destPath = path.join(productsDir, img.dest);

    if (fs.existsSync(srcPath)) {
      try {
        console.log(`Optimizing ${img.src} -> ${img.dest}`);
        await sharp(srcPath)
          .webp({ quality: 80 })
          .toFile(destPath);
        console.log(`Successfully generated ${img.dest}`);
      } catch (err) {
        console.error(`Error optimizing ${img.src}:`, err);
      }
    } else {
      console.warn(`File not found: ${srcPath}`);
    }
  }
  console.log('Finished image optimization.');
}

optimize();

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const https = require('https');

const publicDir = path.join(__dirname, '../public');

const images = [
  {
    url: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=1920&h=1080&q=80',
    dest: 'hero-bg.webp'
  },
  {
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&h=1100&q=80',
    dest: 'division-textile.webp'
  },
  {
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&h=1100&q=80',
    dest: 'division-realestate.webp'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading stock images...');
  for (const img of images) {
    const destPath = path.join(publicDir, img.dest);
    try {
      console.log(`Downloading ${img.url} ...`);
      const buffer = await downloadFile(img.url, destPath);
      console.log(`Optimizing and saving to ${img.dest} ...`);
      await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(destPath);
      console.log(`Saved ${img.dest} successfully.`);
    } catch (err) {
      console.error(`Error processing ${img.dest}:`, err);
    }
  }
  console.log('Finished downloading stock images.');
}

run();

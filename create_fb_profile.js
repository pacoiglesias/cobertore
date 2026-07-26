const sharp = require('sharp');
const path = require('path');

async function createProfilePic() {
  const inputPath = path.join(__dirname, 'public', 'logo-oficial.png');
  const outputPath = path.join(__dirname, 'public', 'fb-profile-logo.png');

  try {
    // We want a 1080x1080 image with a dark blue background (#070b14)
    // The logo will be centered and padded to ensure it fits perfectly inside Facebook's circle crop
    await sharp({
      create: {
        width: 1080,
        height: 1080,
        channels: 4,
        background: { r: 7, g: 11, b: 20, alpha: 1 } // #070b14
      }
    })
    .composite([
      {
        input: inputPath,
        gravity: 'center',
      }
    ])
    .png()
    .toFile(outputPath);
    
    console.log("Image processed successfully at " + outputPath);
  } catch (err) {
    // Fallback: If the logo is larger than 1080x1080, we need to resize the logo first before compositing
    console.log("Direct composite failed, trying resize...", err.message);
    try {
      const resizedLogo = await sharp(inputPath)
        .resize({ width: 800, height: 800, fit: 'inside' })
        .toBuffer();

      await sharp({
        create: {
          width: 1080,
          height: 1080,
          channels: 4,
          background: { r: 7, g: 11, b: 20, alpha: 1 }
        }
      })
      .composite([
        {
          input: resizedLogo,
          gravity: 'center',
        }
      ])
      .png()
      .toFile(outputPath);
      console.log("Image processed with resize at " + outputPath);
    } catch(err2) {
        console.error("Failed completely:", err2);
    }
  }
}

createProfilePic();

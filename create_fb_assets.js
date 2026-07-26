const sharp = require('sharp');
const path = require('path');

async function createAssets() {
  const coverInput = 'C:\\Users\\pacoi\\.gemini\\antigravity\\brain\\b6889a7d-a086-4856-965f-92c1ab51fef5\\.user_uploaded\\media__1785035209584.png';
  const profileInput = 'C:\\Users\\pacoi\\.gemini\\antigravity\\brain\\b6889a7d-a086-4856-965f-92c1ab51fef5\\.user_uploaded\\media__1785035209890.jpg';
  
  const coverOutput = path.join(__dirname, 'public', 'fb_portada_oficial.png');
  const profileOutput = path.join(__dirname, 'public', 'fb_perfil_oficial.png');

  try {
    // 1. Create Facebook Cover (1640 x 624)
    // We will resize the full logo to fit comfortably in the center
    const resizedCoverLogo = await sharp(coverInput)
      .resize({ width: 1000, height: 400, fit: 'inside' })
      .toBuffer();

    await sharp({
      create: {
        width: 1640,
        height: 624,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 } // White background for cover
      }
    })
    .composite([
      { input: resizedCoverLogo, gravity: 'center' }
    ])
    .png()
    .toFile(coverOutput);
    
    console.log("Cover processed at " + coverOutput);

    // 2. Create Facebook Profile Picture (1080 x 1080)
    // Using the 5th image (the spool icon) for the circle profile
    // It's a JPG, so we'll just resize it and pad it with white background
    const resizedProfileLogo = await sharp(profileInput)
      .resize({ width: 800, height: 800, fit: 'inside', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toBuffer();

    await sharp({
      create: {
        width: 1080,
        height: 1080,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([
      { input: resizedProfileLogo, gravity: 'center' }
    ])
    .png()
    .toFile(profileOutput);

    console.log("Profile processed at " + profileOutput);
    
  } catch (err) {
    console.error("Error processing images:", err);
  }
}

createAssets();

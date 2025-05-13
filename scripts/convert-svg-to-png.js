const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/assets/images/medicine-auth.svg'));

sharp(svgBuffer)
  .png()
  .toFile(path.join(__dirname, '../public/assets/images/medicine-auth.png'))
  .then(() => {
    console.log('SVG converted to PNG successfully');
  })
  .catch(err => {
    console.error('Error converting SVG to PNG:', err);
  }); 
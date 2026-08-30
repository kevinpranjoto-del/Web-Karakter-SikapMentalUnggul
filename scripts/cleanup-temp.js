const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const extractedDir = path.join(rootDir, 'assets/images/extracted');

// Remove .jpg files in root
fs.readdirSync(rootDir).forEach(file => {
  if (file.endsWith('.jpg')) {
    fs.unlinkSync(path.join(rootDir, file));
    console.log(`Removed root loose image: ${file}`);
  }
});

// Remove temporary extracted directory if exists
if (fs.existsSync(extractedDir)) {
  fs.rmSync(extractedDir, { recursive: true, force: true });
  console.log('Removed temporary extracted folder: assets/images/extracted');
}

// Remove obsolete scratch scripts
['scripts/extract.ps1', 'scripts/extract-zip.js', 'scripts/organize-images.js'].forEach(scriptPath => {
  const full = path.join(rootDir, scriptPath);
  if (fs.existsSync(full)) {
    fs.unlinkSync(full);
    console.log(`Cleaned script: ${scriptPath}`);
  }
});

console.log('Project structure cleanup finished!');

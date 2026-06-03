const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('LinkForge')) {
      content = content.replace(/LinkForge/g, 'LinkSnap');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}: ${err}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        walkDir(fullPath);
      }
    } else if (
      fullPath.endsWith('.js') || 
      fullPath.endsWith('.jsx') || 
      fullPath.endsWith('.html') || 
      fullPath.endsWith('.json') ||
      fullPath.endsWith('.css')
    ) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'frontend'));
console.log('Replacement complete.');

const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes('Cliqly') || content.includes('cliqly')) {
      content = content.replace(/Cliqly/g, 'Zestlink');
      content = content.replace(/cliqly/g, 'zestlink');
      changed = true;
    }

    if (changed) {
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
      fullPath.endsWith('.css') ||
      fullPath.endsWith('.md')
    ) {
      replaceInFile(fullPath);
    }
  }
}

// Also process the root files specifically
replaceInFile(path.join(__dirname, 'README.md'));
walkDir(path.join(__dirname, 'frontend'));
walkDir(path.join(__dirname, 'backend'));
console.log('Replacement complete.');

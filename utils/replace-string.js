const fs = require('fs');
const path = require('path');

// Validate input
if (process.argv.length < 5) {
  console.log('Usage: node script.js <folder> <searchString> <replaceString>');
  process.exit(1);
}

// Get command line arguments
const folder = process.argv[2];

if (!fs.existsSync(folder)) {
  console.log('Folder does not exist');
  process.exit(1);
}

const searchString = process.argv[3];
const replaceString = process.argv[4];

if (!searchString || !replaceString) {
  console.log('Search and replace strings are required');
  process.exit(1);
}

function replaceInFile(filePath, searchString, replaceString) {
  let fileContent = fs.readFileSync(filePath, 'utf8');
  const newContent = fileContent.replace(new RegExp(searchString, 'g'), replaceString);
  fs.writeFileSync(filePath, newContent);
}

function replaceInFiles(dir, searchString, replaceString) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      replaceInFiles(filePath, searchString, replaceString);
    } else if (path.extname(filePath) === '.js') {
      replaceInFile(filePath, searchString, replaceString);
    }
  });
}

replaceInFiles(folder, searchString, replaceString);
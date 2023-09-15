import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';

// Validate input
if (process.argv.length < 5) {
  console.log('Usage: node script.js <folder> <searchString> <replaceString>');
  process.exit(1);
}

// Get command line arguments
const folder = process.argv[2];

if (!existsSync(folder)) {
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
  let fileContent = readFileSync(filePath, 'utf8');
  const newContent = fileContent.replace(new RegExp(searchString, 'g'), replaceString);
  writeFileSync(filePath, newContent);
}

function replaceInFiles(dir, searchString, replaceString) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      replaceInFiles(filePath, searchString, replaceString);
    } else if (extname(filePath) === '.js') {
      replaceInFile(filePath, searchString, replaceString);
    }
  });
}

replaceInFiles(folder, searchString, replaceString);
// Read a wikipedia dump and extract article title for a specific language and clean up the data
const lang = 'de';
const filePath = 'dump.txt';
const titleLimit = 30000;
const fs = require('fs');
const readline = require('readline');

const lines = [];

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (line.startsWith(`${lang} `)) {
    lines.push(line);
  }
});

rl.on('close', () => {
  // Sort lines based on page views
  const sortedLines = lines.sort((a, b) => {
    const pageViewsA = parseInt(a.split(' ')[2]);
    const pageViewsB = parseInt(b.split(' ')[2]);
    return pageViewsB - pageViewsA; // Descending order
  });

    // Extract and clean titles
  const cleanTitles = sortedLines.map((line) => {
    const title = line.split(' ')[1].replace(/_/g, ' '); // Replace underscores with spaces
    const cleanedTitle = title.replace(/\([^)]*\)/g, '').trim(); // Remove content within parentheses
    return cleanedTitle;
  });

// Filter out titles starting with a word and a colon using a regular expression
const filteredTitles = cleanTitles.filter((title) => {
  const excludedPrefixRegex = /^\w+:/; // Matches any word followed by a colon

  return !excludedPrefixRegex.test(title);
});

    // Remove duplicates using a Set
  const uniqueTitles = [...new Set(filteredTitles)];

  // Print sorted lines
  for (let i = 0; i < titleLimit; i++) 
    console.log(uniqueTitles[i]);
});

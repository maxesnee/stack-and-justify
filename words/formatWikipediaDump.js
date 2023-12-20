const fs = require('fs');
const readline = require('readline');

const filePath = 'dump.txt'; // Replace with your file path

const lines = [];

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  if (line.startsWith('es ')) {
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

  // Filter out titles with specific prefixes
  const filteredTitles = cleanTitles.filter((title) => {
    const excludedPrefixes = ['Category:', 'Help:', 'List of ', 'User:', 'File:', 'Talk:', 'Wikipedia talk:', 'Special:', 'Spécial:', 'Wikipédia:', 'Wikipedia', 'Catégorie:', 'Liste de', 'Liste des', 'Spécial:', 'Discussion:', 'Fichier:', 'Utilisateur:', 'Discussion utilisateur:', 'Aide:', 'Especial:', 'Anexo:', 'Ayuda:', 'Portal:', 'Categoría:', 'Archivo:']; // Add more prefixes as needed
    return !excludedPrefixes.some((prefix) => title.startsWith(prefix));
  });

    // Remove duplicates using a Set
  const uniqueTitles = [...new Set(filteredTitles)];

  // Print sorted lines
  uniqueTitles.forEach((line) => {
    console.log(line);
  });
});

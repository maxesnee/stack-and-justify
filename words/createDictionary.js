const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Nom du fichier d\'entrée (.txt) : ', (inputFile) => {
  rl.question('Nom du fichier de sortie (.json) : ', (outputFile) => {

    // Lecture du fichier texte
    fs.readFile(inputFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Erreur de lecture du fichier :', err);
        rl.close();
        return;
      }

      // Séparation des lignes en un tableau de mots
      const words = data.split('\n').map(word => word.trim());

      // Création de l'objet JSON
      const jsonData = {
        words: words
      };

      // Conversion de l'objet JSON en chaîne JSON
      const jsonString = JSON.stringify(jsonData, null, 2);

      // Écriture du fichier JSON de sortie
      fs.writeFile(outputFile, jsonString, 'utf8', (err) => {
        if (err) {
          console.error('Erreur d\'écriture du fichier JSON de sortie :', err);
          rl.close();
          return;
        }
        console.log('Conversion réussie! Le fichier JSON a été enregistré sous', outputFile);
        rl.close();
      });
    });
  });
});

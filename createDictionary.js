// Read files and create a dictionary object
document.getElementById('files').addEventListener('change', function() {

	const files = document.getElementById("files").files;

	let dictionnary = {
		'languages': {}
	};

	for (const file of files) {
		if (file) {
			const languageName = file.name.split('.')[0];

			const reader = new FileReader();

			reader.onload = function(event) {
				let words = event.target.result.split('\r\n');

				if (words.length == 1) {
					words = words[0].split('\n');
				}
				if (words.length == 1) {
					words = words[0].split('\r');
				}

				dictionnary.languages[languageName] = {};
				dictionnary.languages[languageName].words = words;
				
			}
			reader.readAsText(file, "UTF-8");
		}
	}

})


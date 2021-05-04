const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const app = new Vue({
	el: '#specimen',
	data: {
		width: 760,
		lines: [],
		dictionaries: [titles, dictionary.languages.french.words],
		filters: ['lowercase'],
		fontWeight: 300,
	},
	created: function() {
		this.addLine();
		this.addLine();
		this.addLine();
		this.addLine();
		this.addLine();
		this.addLine();

		this.lines[0].size = 156;
		this.refreshLine(this.lines[0]);
		this.lines[1].size = 128;
		this.refreshLine(this.lines[1]);
		this.lines[2].size = 96;
		this.refreshLine(this.lines[2]);
		this.lines[3].size = 72;
		this.refreshLine(this.lines[3]);
		this.lines[4].size = 48;
		this.refreshLine(this.lines[4]);
		this.lines[5].size = 36;
		this.refreshLine(this.lines[5]);
	},
	methods: {
		incrementSize(line) {
			line.size++;
		},
		decrementSize(line) {
			line.size--;
		},
		addLine() {
			const size = 36;
			const text = this.getText(size);
			this.lines.push({
				size,
				text
			})
		},
		refreshLine(line) {
			line.text = this.getText(line.size);
		},
		getRandomText() {
			const dictIndex = Math.floor(Math.random() * this.dictionaries.length);
			const dictionary = this.dictionaries[dictIndex];
			const index = Math.floor(Math.random() * dictionary.length);
			const text = dictionary[index];
			return {
				string: text,
				index: index,
				dictIndex: dictIndex
			};
		},
		getText(size) {
			ctx.font = this.fontWeight + ' ' + size + 'px Scopra';
			let text = this.getRandomText();
			let textWidth = Math.floor(ctx.measureText(this.applyFilters(text.string)).width);
			let i = 0;
			while (textWidth < this.width - 3 || textWidth > this.width - 1 && i < 10000) {
				text = this.getRandomText();
				textWidth = Math.round(ctx.measureText(this.applyFilters(text.string)).width);
				i++
			}
			return this.applyFilters(text.string);
		},
		applyFilters(string) {
			let filteredString = string;
			this.filters.forEach(function(filter) {
				switch (filter) {
					case 'lowercase':
					filteredString = filteredString.toLowerCase()
					break;
				}
			});	
			return filteredString;
			
		}
	}
});
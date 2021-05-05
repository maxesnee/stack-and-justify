const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('#app');
const sortedDict = sortDict(dictionary.languages.french.words);
let filters = ['lowercase'];
const fontWeight = 300;
const layout = {
	lineWidth: 350
}

function sortDict(dict) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	ctx.font = "100px Scopra";
	const sorted = {};

	for (word of dict) {
		let width = Math.floor(ctx.measureText(word).width);
		if (sorted[width] === undefined) {
			sorted[width] = []
		}
		sorted[width].push(word)
	}
	return sorted;
}

function getWord(size, width) {
	let tolerance = 5;
	let words = [];
	let scaledWidth = Math.round(width * (100 / size));

	for (let i = scaledWidth - tolerance; i <= scaledWidth + tolerance; i++) {
		if (sortedDict[i] !== undefined) {
			words.push(...sortedDict[i]);	
		}
	}

	let randomIndex = Math.floor(Math.random()*words.length);
	return words[randomIndex] ?? "";
}

function applyFilters(string) {
	let filteredString = string;
	filters.forEach(function(filter) {
		switch (filter) {
			case 'lowercase':
			filteredString = filteredString.toLowerCase()
			break;
		}
	});	
	return filteredString;

}

const UID = (function() {
	let lastId = -1;

	function newId() {
		lastId += 1;
		return lastId;
	}

	return function() {
		return newId();
	}
})();

function createElement(tagName, props, ...children) {
	const el = document.createElement(tagName);

	for (key in props) {
		if (key === "class") {
			el.className = props.class
			continue;
		}

		if (typeof props[key] === "object") {
			Object.assign(el[key], props[key]);
			continue;
		}

		el[key] = props[key];
	}

	el.append(...children);

	if (props.update) {
		el.update = props.update;
		el.update();
	}

	return el;
}

function List(el, items, constructor) {
	let eventPrefix = constructor.name.toLowerCase();
	let map = {};
	let activeFilter;
	let activeSort;

	let itemElements = items.map(item => constructor(item));
	let itemUIDs = items.map(item => item.id);
	el.append(...itemElements);

	document.addEventListener(`${eventPrefix}-created`, function() {
		let newItem = items[items.length-1];
		let itemEl = Task(newItem);
		itemElements.push(itemEl);
		itemUIDs.push(newItem.id);
		
		if (activeFilter) {
			el.filter(activeFilter);	
		}
	});

	document.addEventListener(`${eventPrefix}-removed`, function(e) {
		let itemUID = e.detail;
		let itemIndex = itemUIDs.findIndex(uID => uID === itemUID);

		el.removeChild(itemElements[itemIndex]);
		itemElements.splice(itemIndex, 1);
		itemUIDs.splice(itemIndex, 1);
	});

	el.update = function() {
		for (const item of itemElements) {
			item.update()
		}
	}

	return el;
}

function Div(props, ...children) {
	return createElement('div', props, ...children);
}

function Span(props, ...children) {
	return createElement('span', props, ...children);
}

function Button(props, ...children) {
	return createElement('button', props, ...children);
}

function Input(props, ...children) {
	return createElement('input', props, ...children);
}

function Label(props, ...children) {
	return createElement('label', props, ...children);
}

function Line(size) {
	let text = "";
	const sizeLabel = Span({});
	const textBlock = Div({class: "text"});

	const el = Div({class: "line"}, 
		Div({class: "size-select"},
			Button({onclick: decrementSize }, "◀︎"),
			sizeLabel,
			Button({onclick: incrementSize}, "▶︎")
		),
		textBlock,
		Div({class: "refresh"},
			Button({onclick: update}, '↩︎')
		)
	);

	function decrementSize() {
		size--;
		update();
	}

	function incrementSize() {
		size++;
		update();
	}

	function update() {
		sizeLabel.textContent = size;

		text = getWord(size, layout.lineWidth);
		textBlock.textContent = text;
		textBlock.style.fontSize = size + "px"; 
		textBlock.style.width = layout.lineWidth + "px";
		textBlock.style.fontWeight =  fontWeight;
	}

	update();

	el.update = update;

	return el;
}

function SizeSlider(lineWidth = 350) {
	const sizeLabel = Label({for: "line-width"});
	const sizeInput = Input({name: "line-width", type: "range", min: 50, max: 1000, value: lineWidth, oninput: update});

	const el = Div({class: "size-slider"}, 
		sizeLabel,
		sizeInput
	);

	function update(e) {
		lineWidth = sizeInput.value;
		sizeLabel.textContent = lineWidth;

		if (el.oninput !== null) {
			el.oninput();	
		}
		
	}

	update();

	Object.defineProperty(el, "value", {
		get: () => {
			return lineWidth
		}
	});

	return el;
}

function Specimen() {

	const sizes = [120, 96, 72, 60];

	const slider = SizeSlider();
	slider.oninput = update;
	const lines = List(Div({class: "lines"}), sizes, Line);

	function addLine() {
		lines.append(Line(36, layout));
	}

	function update() {
		layout.lineWidth = slider.value;
		lines.update();
	}

	return Div({class:"specimen"},
		slider,
		lines,
		Div({class: "line add-line"}, 
			Button({onclick: addLine}, "+")
		)
	)
}

container.append(Specimen());
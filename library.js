const createElement = function(selector, props = {}, ...children) {
	const elInfo = parseSelector(selector);
	const el = document.createElement(elInfo.tag);
	el.className = elInfo.className;
	el.id = elInfo.id;

	if (props instanceof HTMLElement === true || typeof props === "string") {
		children = [props].concat(children);
		props = {};
	}

	for (key in props) {
		if (key === "class") {
			el.className = props.class
			continue;
		}
		if (key === "for") {
			el.HTMLFor = props.for
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

const $ = createElement;

function parseSelector(str) {
	const tag = str.match(/[^\.#]*/)[0];
	const classes = Array.from(str.matchAll(/\.[^\.#]*/g), m => m[0].replace('.', ''));
	const ids = Array.from(str.matchAll(/#[^#]*/g), m => m[0].replace('#', ''));

	return {
		tag,
		className: classes.join(' '),
		id: ids.join(' ')
	}
}

const createList = function(el, arr, constructor) {
		let init = true;
		let children = new Map();
		
		for (let item of arr) {
			let child = constructor(item)();
			children.set(item, child);
			el.appendChild(child);
		}

		el.update = function() {
			for (let item of arr) {
				if (!children.has(item)) {
					// There's a new item in the array
					let newChild = constructor(item)();
					children.set(item, newChild);
					el.appendChild(newChild);
				}
			}

			for (let [item, child] of children) {
				if (!arr.includes(item)) {
					// An element has been removed from the array
					el.removeChild(children.get(item));
					children.delete(item);
				}
			}
		}

		el.update();

		return el;
}

function List(el, items, constructor) {
	let elements = items.map(item => constructor(item));
	let ids = items.map(item => item.id);
	el.append(...elements);

	el.add = function(itemEl, id) {
		elements.push(itemEl);
		el.append(itemEl);
		ids.push(id);
	};

	// document.addEventListener(`${eventPrefix}-removed`, function(e) {
	// 	let itemUID = e.detail;
	// 	let itemIndex = itemUIDs.findIndex(uID => uID === itemUID);

	// 	el.removeChild(itemElements[itemIndex]);
	// 	itemElements.splice(itemIndex, 1);
	// 	itemUIDs.splice(itemIndex, 1);
	// });

	el.update = function() {
		for (const itemEl of elements) {
			itemEl.update()
		}
	}

	return el;
}
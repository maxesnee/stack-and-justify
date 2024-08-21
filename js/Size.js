export const Size = function(_str) {
	let value, unit;
	let callbacks = [];

	({value, unit} = processStr(_str));

	function processStr(str) {
		if (typeof str === 'string' && str !== ""){
			str = str.replace(',', '.');
			var split = str.match(/^([-.\d]+(?:\.\d+)?)(.*)$/);
			return {'value': parseFloat(split[1].trim()), 'unit': split[2].trim() || unit};
		}
		else {
			return { 'value': value, 'unit': unit };
		}
	}

	function increment() {
		value += 1;
		onchange();
	}

	function decrement() {
		value -= 1;
		onchange();
	}

	function set(str) {
		({value, unit} = processStr(str));
		onchange();
	}

	function get() {
		return `${parseFloat(value.toFixed(2))}${unit}`;
	}

	function getIn(targetUnit) {
		return convert(value, unit).to(targetUnit);
	}

	function setIn(srcUnit, newValue) {
		value = convert(newValue, srcUnit).to(unit);
		onchange();
	}

	function convert(value, unit) {
		const ratios = {
			'cm': 37.8,
			'mm': 3.78,
			'in': 96,
			'pt': 1.333,
			'pc': 16,
			'px': 1
		}

		const valueInPixel = value * ratios[unit];

		return {
			to: function(targetUnit) {
				return valueInPixel / ratios[targetUnit];
			}
		}
	}

	function onchange() {
		callbacks.forEach(callback => callback());
	}

	return {
		get value() {
			return value;
		},
		get unit() {
			return unit
		},
		get,
		getIn,
		set,
		setIn,
		increment,
		decrement,
		onchange(callback) {
			callbacks.push(callback);
		}
	}
}
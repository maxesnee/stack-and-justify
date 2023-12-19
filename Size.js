export const Size = function(_str) {
	let value, unit;
	let onchange = function() {
		console.log('no onchange function defined');
	};

	({value, unit} = processStr(_str));

	function processStr(str) {
		if (typeof str === 'string' && str !== ""){
			var split = str.match(/^([-.\d]+(?:\.\d+)?)(.*)$/);
			return {'value': parseFloat(split[1].trim()), 'unit': split[2].trim()};
		}
		else{
			return { 'value': parseFloat(str), 'unit': "" };
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
		set onchange(val) {
			onchange = val;
		}
	}
}
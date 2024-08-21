export function generateUID(str) {
	if (str && str.length) {
		return generateUIDFromString(str);
	}

    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}


// Generate hash code from string
export function generateUIDFromString(str) {
  var hash = 0,
    i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}


export function Box(val) {
  let _val = val;
  let callbacks = [];
  
  return {
    get val() {
      return _val;
    },
    set val(newVal) {
      _val = newVal;
      callbacks.forEach(callback => callback());
    },
    onchange(callback) {
      callbacks.push(callback);
    }
  }
}

export function Computed(fn) {
  let _val = fn();
  let callbacks = [];
  return {
    get val() {
      return _val;
    },
    update() {
      const newVal = fn();
      if (_val !== newVal) {
        _val = newVal;
        callbacks.forEach(callback => callback());
      }
    },
    onchange(callback) {
      callbacks.push(callback);
    },
    dependsOn(...dependencies) {
      dependencies.forEach(dependency => {
        if (typeof dependency.onchange === 'function') {
          dependency.onchange(this.update);
        }
      });
    }
  }
}
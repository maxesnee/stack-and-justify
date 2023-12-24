export function random(min, max) {
	return Math.random() * (max - min) + min;
}

export function shuffle(array) {
	let currentIndex = array.length,  randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}

	return array;
}

export function generateUID() {
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}

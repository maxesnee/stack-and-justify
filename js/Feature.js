import { generateUID } from "./Helpers.js";

// List of user controlled features that should be activated by default
const defaultFeatures = ['liga', 'clig', 'calt'];

export function Feature(tag, name) {
	const id = generateUID();
	let selected = defaultFeatures.includes(tag) ? true : false;
	let fontIds = [];

	return {
		id,
		tag,
		name,
		selected,
		fontIds
	}
}
import { generateUID } from './Helpers.js';

export const Filter = function(name, label, apply) {
	const id = generateUID();
	return {
		id,
		name,
		label,
		apply
	}
}
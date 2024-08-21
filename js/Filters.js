import { Filter } from './Filter.js';

export const Filters = [
	Filter('lowercase', 'Lowercase', (str) => str.toLowerCase()),
	Filter('uppercase', 'Uppercase', (str) => str.toUpperCase()),
	Filter('capitalised', 'Capitalised', (str) => str[0].toUpperCase() + str.slice(1))
];


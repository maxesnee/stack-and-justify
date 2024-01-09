import { Layout } from '../Layout.js';

export function NewLineButton(initialVnode) {
	function onclick() {
		Layout.addLine();
	}

	return {
		view: function(vnode) {
			return m('div.new-line', {onclick},
				m('button.new-line-button', '⊕ Add new line')
			)
		}
	}
}
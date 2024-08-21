import { Layout } from '../Layout.js';

export function NewLineButton(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.new-line', {onclick: () => Layout.addLine()},
				m('button.new-line-button', '⊕ Add new line')
			)
		}
	}
}
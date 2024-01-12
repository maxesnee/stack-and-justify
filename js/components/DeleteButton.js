import { Tooltip } from './Tooltip.js';

export function DeleteButton(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.update-button',
				m('button', {onclick: vnode.attrs.onclick }, '🗑'),
				m(Tooltip, {label: 'Delete line'})
			)
		}
	}
}
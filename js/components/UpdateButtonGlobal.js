import { Tooltip } from './Tooltip.js';

export function UpdateButtonGlobal(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.update-button',
				m('button', {onclick: vnode.attrs.onclick },'↻'),
				m(Tooltip, {label: 'Refresh all lines'})
			)
		}
	}
}
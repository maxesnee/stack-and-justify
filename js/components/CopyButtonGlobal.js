import { Tooltip } from './Tooltip.js';

export function CopyButtonGlobal(initialVnode) {
	return {
		oncreate: function(vnode) {
			vnode.dom.querySelector('button').addEventListener('click', vnode.attrs.onclick);
		},
		view: function(vnode) {
			return m('div.copy-button',
				m('button', '📋'),
				m(Tooltip, {label: 'Copy all lines to clipboard', activeLabel: 'Copied'})
			)
		}
	}
}
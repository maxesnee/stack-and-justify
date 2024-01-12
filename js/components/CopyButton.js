import { Tooltip } from './Tooltip.js';

export function CopyButton(initialVnode) {
	return {
		oncreate: function(vnode) {
			vnode.dom.querySelector('button').addEventListener('click', vnode.attrs.onclick);
		},
		view: function(vnode) {
			return m('div.copy-button',
				m('button', '📋'),
				m(Tooltip, {label: 'Copy line to clipboard', activeLabel: 'Copied'})
			)
		}
	}
}
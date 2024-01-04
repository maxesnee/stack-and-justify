export function UpdateButton(initialVnode) {
	const tooltipStr = "Refresh line";

	return {
		view: function(vnode) {
			return m('div.update-button',
				m('button', {onclick: vnode.attrs.onclick },'↻'),
				m('div.update-tooltip', tooltipStr)
			)
		}
	}
}
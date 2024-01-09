export function DeleteButton(initialVnode) {
	const tooltipStr = "Delete line";

	return {
		view: function(vnode) {
			return m('div.update-button',
				m('button', {onclick: vnode.attrs.onclick },'🗑'),
				m('div.update-tooltip', tooltipStr)
			)
		}
	}
}
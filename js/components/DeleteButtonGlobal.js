export function DeleteButtonGlobal(initialVnode) {
	const tooltipStr = "Clear all lines";

	return {
		view: function(vnode) {
			return m('div.update-button',
				m('button', {onclick: vnode.attrs.onclick },'🗑'),
				m('div.update-tooltip', tooltipStr)
			)
		}
	}
}
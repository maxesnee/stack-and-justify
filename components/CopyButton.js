export function CopyButton(initialVnode) {
	return {
		view: function(vnode) {
			return m('button.copy-button', {onclick: vnode.attrs.onclick}, '📋')
		}
	}
}
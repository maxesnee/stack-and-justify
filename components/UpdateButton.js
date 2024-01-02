export function UpdateButton(initialVnode) {

	return {
		view: function(vnode) {
			return m('button.update-button', {onclick: vnode.attrs.onclick },'↻')
		}
	}
}
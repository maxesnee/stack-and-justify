export function DarkModeButton(initialVnode) {
	return {
		view: function(vnode) {
			return m('button.dark-mode-btn', {
				onclick: () => { document.body.classList.toggle('dark') }
			}, "◒")
		}
	}
}
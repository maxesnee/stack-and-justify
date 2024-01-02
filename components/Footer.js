export function Footer(initialVnode) {
	return {
		view: function(vnode) {
			return m('footer.footer',
				m('div.credit',
					m('span', 'Created by '),
					m('a', {target: "_blank", href: "https://max-esnee.com/"}, 'Max Esnée ↗')
				)
			)
		}
	}
}
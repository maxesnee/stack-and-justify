export function Footer(initialVnode) {
	return {
		view: function(vnode) {
			return m('footer.footer',
				m('div.credit',
					m('span', 'Created by '),
					m('a', {target: "_blank", href: "https://max-esnee.com"}, 'Max Esnée ↗')
				),
				m('div.github',
					m('span', 'Source code available on '),
					m('a', {target: "_blank", href: "https://github.com/maxesnee/stack-and-justify"}, 'Github ↗')
				)
			)
		}
	}
}
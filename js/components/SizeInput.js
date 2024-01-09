import { Layout } from "../Layout.js";

export function SizeInput(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.size-input',
				m('button', {
					onclick: () => { vnode.attrs.params.size.decrement() },
					disabled: Layout.sizeLocked
				}, '－'),
				m('input', {
					type: 'text', 
					value: vnode.attrs.params.size.get(), 
					onchange: (e) => {vnode.attrs.params.size.set(e.currentTarget.value)},
					disabled: Layout.sizeLocked
				}),
				m('button', {
					onclick: () => { vnode.attrs.params.size.increment() },
					disabled: Layout.sizeLocked
				}, '＋')
				)
		}
	}
}
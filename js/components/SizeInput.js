import { Layout } from "../Layout.js";

export function SizeInput(initialVnode) {
	let isFocused = false;
	let editValue = "";

	function onfocus(e) {
		isFocused = true;
		editValue = e.target.value;
	}

	function oninput(e) {
		if (isFocused) {
			editValue = e.target.value;
		}	
	}

	function onblur(e) {
		isFocused = false;
	}

	return {
		view: function(vnode) {
			return m('div.size-input',
				m('button', {
					onclick: () => { vnode.attrs.params.size.decrement() },
					disabled: Layout.sizeLocked
				}, '－'),
				m('input', {
					type: 'text', 
					value: isFocused ? editValue : vnode.attrs.params.size.get(), 
					onchange: (e) => {vnode.attrs.params.size.set(e.currentTarget.value)},
					disabled: Layout.sizeLocked,
					oninput,
					onfocus,
					onblur
				}),
				m('button', {
					onclick: () => { vnode.attrs.params.size.increment() },
					disabled: Layout.sizeLocked
				}, '＋')
			)
		}
	}
}
export function CopyButton(initialVnode) {
	const copyStr = "Copy to clipboard";
	const copiedStr = "Copied";

	function onclick(e, vnode) {
		vnode.dom.querySelector('.copy-tooltip').textContent = copiedStr;

		vnode.attrs.onclick(e);
	}

	function onmouseleave(e, vnode) {
		vnode.dom.querySelector('.copy-tooltip').textContent = copyStr;
	}

	return {
		view: function(vnode) {
			return m('div.copy-button',
				m('button', {onclick: (e) => onclick(e, vnode), onmouseleave: (e) => onmouseleave(e, vnode)}, '📋'),
				m('div.copy-tooltip', copyStr)
			)
		}
	}
}
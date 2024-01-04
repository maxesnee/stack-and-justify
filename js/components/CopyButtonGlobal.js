export function CopyButtonGlobal(initialVnode) {
	const copyStr = "Copy all lines to clipboard";
	const copiedStr = "Copied";

	function onclick(e, vnode) {
		const tooltip = vnode.dom.querySelector('.copy-tooltip');
		tooltip.textContent = copiedStr;
		tooltip.classList.add('copied');

		vnode.attrs.onclick(e);
	}

	function onmouseleave(e, vnode) {
		const tooltip = vnode.dom.querySelector('.copy-tooltip');
		tooltip.textContent = copyStr;
		tooltip.classList.remove('copied');
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
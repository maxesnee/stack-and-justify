export function Tooltip(initialVnode) {

	function onclick(vnode) {
		if (vnode.attrs.activeLabel) {
			vnode.dom.textContent = vnode.attrs.activeLabel;
			positionTooltip(vnode);	
		}	
	}

	function onmouseleave(vnode) {
		vnode.dom.textContent = vnode.attrs.label;
		positionTooltip(vnode);
	}

	function positionTooltip(vnode) {
		const width = vnode.dom.offsetWidth;
		const rect = vnode.dom.getBoundingClientRect();
		const padding = parseFloat(getComputedStyle(document.body).getPropertyValue('padding-right'))/2;
		let pos = -width/2;

			// if tooltip is outside the viewport
		if (rect.right + pos + padding > window.innerWidth) {
			pos -= rect.right + pos + padding - window.innerWidth;
		}

		vnode.dom.style.transform = `translateX(${pos}px)`;
	}

	return {
		oncreate: function(vnode) {
			positionTooltip(vnode);
			vnode.dom.parentElement.addEventListener('click', () => onclick(vnode));
			vnode.dom.parentElement.addEventListener('mouseleave', () => onmouseleave(vnode));
		},
		view: function(vnode) {
			return m('div.tooltip', vnode.attrs.label);
		}
	}
}
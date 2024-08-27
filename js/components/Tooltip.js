export function Tooltip(initialVnode) {

	function onclick(vnode) {
		if (vnode.attrs.activeLabel) {
			vnode.dom.textContent = vnode.attrs.activeLabel;
			positionTooltip(vnode);	
		}	
	}

	function onmouseleave(vnode) {
		if (vnode.attrs.activeLabel) {
			vnode.dom.textContent = vnode.attrs.label;
			positionTooltip(vnode);
		}
	}

	function positionTooltip(vnode) {
		const rect = vnode.dom.getBoundingClientRect();
		const parentRect = vnode.dom.parentElement.getBoundingClientRect();
		const padding = parseFloat(getComputedStyle(document.body).getPropertyValue('padding-right'))/2;
		let pos = -rect.width/2 + parentRect.width/2;

		// if tooltip is outside the viewport
		if (rect.right + pos + padding > document.body.clientWidth) {
			pos -= (rect.right + pos + padding) - document.body.clientWidth;
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
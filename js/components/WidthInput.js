import { Layout } from "../Layout.js";

export function WidthInput(initialVnode) {
	let isDragging = false;
	let startFromRight = null;
	let startWidth = Layout.width.getIn('px');
	let startX = 0;
	let dX = 0;
	let isFocused = false;
	let editValue = "";

	document.body.onmousemove = onmousemove;
	document.body.onmouseup = onmouseup;

	function onmousedown(e) {
		startFromRight = e.currentTarget.classList.contains('right');
		isDragging = true;
		startX = e.clientX;
		startWidth = Layout.width.getIn('px');
	}

	function onmousemove(e) {
		if (isDragging) {
			dX = e.clientX - startX;

			// Invert delta if dragging started from left side
			dX = startFromRight ? dX : -dX;

			// Width is distributed on both side, so this allow 
			// the resizing to be in sync with cursor visually
			dX = dX*2;

			// Prevent from getting negative width
			dX = dX > -startWidth ? dX : -startWidth;

			// Move the label if the input is too small			
			const label = document.querySelector('.width-input input');

			if (label.offsetWidth > startWidth + dX) {
				label.classList.add('small');
			} else {
				label.classList.remove('small');
			}

			Layout.width.setIn('px', startWidth + dX);
			m.redraw();
		}
	}

	function onmouseup(e) {
		isDragging = false;
	}

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
			return m('div.width-input', {style: { width: Layout.width.get()}}, 
				m('div.width-input-handle.left', {onmousedown}),
				m('span.width-input-line'),
				m('input', {
					type: 'text', 
					value: isFocused ? editValue : Layout.width.get(), 
					onchange: (e) => {Layout.width.set(e.currentTarget.value)},
					oninput,
					onfocus,
					onblur
				}),
				m('span.width-input-line'),
				m('div.width-input-handle.right', {onmousedown})
				)
		}
	}
}
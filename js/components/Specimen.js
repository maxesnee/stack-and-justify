import { AppState } from "../AppState.js";
import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";
import { FontItems } from "./FontItems.js";
import { Line } from "./Line.js";
import { SizeInputGlobal } from "./SizeInputGlobal.js";
import { FontSelectGlobal } from "./FontSelectGlobal.js";
import { WidthInput } from "./WidthInput.js";
import { CaseSelectGlobal } from "./CaseSelectGlobal.js";
import { CopyButtonGlobal } from "./CopyButtonGlobal.js";
import { UpdateButtonGlobal } from "./UpdateButtonGlobal.js";
import { NewLineButton } from "./NewLineButton.js";
import { DeleteButtonGlobal } from "./DeleteButtonGlobal.js";


export function Specimen(initialVnode) {
	let isDragging = false;
	let draggedEl = null;
	let draggedClone = null;
	let dragStartPosX;
	let dragStartPosY;

	function onmousedown(e) {
		const target = e.target;

		// Don't prevent the text itself from being selected
		if (target.classList.contains('text')) return;

		// Only target the line itself or the immediate children
		// to prevent from triggering dragging when interacting with inputs
		if (!target.classList.contains('specimen-line') &&
			!target.parentElement.classList.contains('specimen-line')) {
			return;
		}

		// Mark the line being dragged
		draggedEl = target.closest('.specimen-line');

		// Prevent triggering text selection while dragging
		draggedEl.style.userSelect = 'none';

		// Deselect all text
		window.getSelection().removeAllRanges()

		// Create a clone of the line and display it
		draggedClone = createClone(draggedEl);
		draggedEl.insertAdjacentElement('beforebegin', draggedClone);

		// Hide the line being dragged
		draggedEl.classList.add('dragged');

		// Get the mouse position
		dragStartPosX = e.clientX;
		dragStartPosY = e.clientY;

		isDragging = true;

		// console.log(`started dragging: ${target.className}`);
	}

	function onmousemove(e) {
		if (!isDragging) return;

		const dragOffsetX = e.clientX - dragStartPosX;
		const dragOffsetY = e.clientY - dragStartPosY;

		// The clone follows the mouse while dragging
		draggedClone.style.transform = `translate(${dragOffsetX}px, ${dragOffsetY}px)`;

		// Get the drop target
		const lineEls = document.querySelectorAll('.specimen-line');
		lineEls.forEach(lineEl => {
			if (lineEl === draggedEl) return;

			const rect = lineEl.getBoundingClientRect();
			if (e.clientY > rect.top && e.clientY <= rect.bottom) {
				// Get the line and move to the new index
				const line = Layout.getLine(draggedEl.id);
				const targetIndex = Layout.indexOf(lineEl.id);

				Layout.moveLine(line, targetIndex);
				m.redraw();
			}
		});

		// console.log('dragging');
	}

	function onmouseup(e) {
		if (!isDragging) return;

		draggedEl.classList.remove('dragged');
		draggedEl.style.userSelect = '';
		draggedEl = null;

		draggedClone.remove();
		draggedClone = null;

		isDragging = false;

		// console.log('stopped dragging');
	}


	return {
		oncreate: function(vnode) {
			vnode.dom.querySelector('.specimen-body').addEventListener('mousedown', onmousedown);
			window.addEventListener('mousemove', onmousemove);
			window.addEventListener('mouseup', onmouseup);
		},
		view: function(vnode) {
			return m('div', {class: 'specimen', style: {display: AppState.showAbout ? 'none' : ''}},
				m('header.specimen-header',
					m('div.line-left-col',
						m(SizeInputGlobal),
						Fonts.list.length ? m(FontSelectGlobal) : ''
					),
					m('div.line-middle-col',
						m(WidthInput)
					),
					m('div.line-right-col',
						m(CaseSelectGlobal),
						m(CopyButtonGlobal, {onclick: Layout.copyText}),
						m(UpdateButtonGlobal, {onclick: Layout.update}),
						m(DeleteButtonGlobal, {onclick: Layout.clear})
					),
				),
				m('div.specimen-body',
					Layout.lines.map((line) => m(Line, {line, key:line.id})),
					m(NewLineButton)
				)
			)
		}
	}
}

function createClone(target) {
	const rect = target.getBoundingClientRect();
	const clone = target.cloneNode(true);
	const cloneChildEls = clone.children;
	const targetChildEls = target.children;
	const cloneSelectEls = clone.querySelectorAll('select');
	const targetSelectEls = target.querySelectorAll('select');

	target.style.position = "relative";
	clone.classList.add('drag-clone');

	// The clone is fixed, so it loses the grid of the target element
	// to keep it visually identical, we have to position everything absolutely
	clone.style.position = 'fixed';
	clone.style.width = rect.width + 'px';
	clone.style.height = rect.height + 'px';
	clone.style.left = rect.left + 'px';
	clone.style.top = rect.top + 'px';

	for (let i = 0; i < cloneChildEls.length; i++) {
		cloneChildEls[i].style.position = 'absolute';
		cloneChildEls[i].style.left = targetChildEls[i].offsetLeft + 'px';
		cloneChildEls[i].style.width = targetChildEls[i].offsetWidth + 'px';
		cloneChildEls[i].style.top = targetChildEls[i].offsetTop + 'px';
		cloneChildEls[i].style.height = targetChildEls[i].offsetHeight + 'px';
	}

	// The clone doesn't inherit the selected options
	for (let i = 0; i < cloneSelectEls.length; i++) {
		cloneSelectEls[i].value = targetSelectEls[i].value;
	}

	return clone;
}
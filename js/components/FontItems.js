import { Fonts } from "../Fonts.js";
import { FontItem } from './FontItem.js';

export function FontItems(initialVnode) {
	let scrollState = 'start';
	let scroll = false;
	let draggedItem = null;
	let draggedClone = null;
	let dragStartX = 0;

	// Drag and drop reordering of the items in the list
	function onmousedown(e) {
		if (e.target.classList.contains('font-item-remove')) return;

		draggedItem = e.target.closest('.font-item');
		
		if (!draggedItem) return;

		const boundingRect = draggedItem.getBoundingClientRect();

		draggedClone = draggedItem.cloneNode(true);
		draggedClone.classList.add('drag-clone');
		draggedClone.style.left = `${boundingRect.x}px`;
		dragStartX = e.clientX;

		draggedItem.dataset.dragged = '';
		draggedItem.parentNode.append(draggedClone);
	}

	window.addEventListener('mousemove', (e) => {
		if (draggedItem) {
			// Update the position of the clone
			const dX = e.clientX - dragStartX;
			draggedClone.style.transform = `translateX(${dX}px)`;

			// Calculate the new position in the list
			const fontItems = document.querySelectorAll('.font-item');
			fontItems.forEach(fontItem => {
				if (fontItem === draggedItem || fontItem === draggedClone) return;

				const itemBoundingRect = fontItem.getBoundingClientRect();
				fontItem.style.background = '';
				// Check if we are over this item’s position
				if (e.clientX > itemBoundingRect.left && e.clientX <= itemBoundingRect.right) {
					const font = Fonts.get(draggedItem.id);
					const targetIndex = Fonts.indexOf(fontItem.id);
					// Move the font in the list to the new position
					Fonts.move(font, targetIndex);
					m.redraw();
				}
			});
		}
	});

	window.addEventListener('mouseup', (e) => {
		if (draggedItem) delete draggedItem.dataset.dragged;
		draggedItem = null;
		if (draggedClone) draggedClone.remove();
		draggedClone = null;
	});
	

	// Calculate the position of the scroll to display the left and right overlays
	function updateScrollState() {
		const scroller = document.querySelector('.font-items-scroller');
		const scrollAmount = scroller.scrollWidth - scroller.offsetWidth;
		const scrollFromStart = scroller.scrollLeft;
		const scrollFromEnd = scrollAmount - scroller.scrollLeft;
		scroll = scrollAmount > 0;
		scroller.classList.remove('start', 'middle', 'end');

		if (!scroll) return;

		if (scrollFromStart <= 0) {
			scrollState = 'start';
		} else if (scrollFromEnd <= 0) {
			scrollState = 'end';
		} else {
			scrollState = 'middle';
		}

		scroller.classList.add(scrollState);
	}

	function scrollToStart() {
		const scroller = document.querySelector('.font-items-scroller');
		scroller.scrollTo(0, 0);
	}

	function scrollToEnd() {
		const scroller = document.querySelector('.font-items-scroller');
		scroller.scrollTo(scroller.scrollWidth, 0);
	}


	return {
		oncreate: function(vnode) {
			// Update the scroll state and redraw when an element is added or removed from the list
			const scrollObserver = new MutationObserver(() => {
				updateScrollState();
				m.redraw();
			}).observe(vnode.dom.querySelector('.font-items-scroller'), {childList: true});

			updateScrollState();
		},
		view: function(vnode) {
			return m('div.font-items', {onmousedown},
				scroll && scrollState !== 'start' ? m('button.scroll-left-button', {onclick: scrollToStart}, '◁') : '',
				m('div.font-items-scroller', {onscroll: updateScrollState},
					Fonts.list.map(font => {
						return m(FontItem, {key: font.id, font: font})
					})
				),
				scroll && scrollState !== 'end' ? m('button.scroll-right-button', {onclick: scrollToEnd}, '▷') : '',
			)
		}
	}
}
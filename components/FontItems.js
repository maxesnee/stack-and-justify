import { Fonts } from "../Fonts.js";
import { FontItem } from './FontItem.js';

export function FontItems(initialVnode) {
	let scrollState = 'start';
	let scroll = false;

	function onscroll() {
		const scroller = document.querySelector('.font-items-scroller');
		const scrollAmount = scroller.scrollWidth - scroller.offsetWidth;
		const scrollFromStart = scroller.scrollLeft;
		const scrollFromEnd = scrollAmount - scroller.scrollLeft;

		if (0 <= scrollFromStart && scrollFromStart < scrollAmount * 0.1) {
			scrollState = 'start';
		} else if (0 <= scrollFromEnd && scrollFromEnd < scrollAmount * 0.1) {
			scrollState = 'end';
		} else {
			scrollState = 'middle';
		}

		scroller.classList.remove('start', 'middle', 'end');
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
			const scrollObserver = new MutationObserver(() => {
				onscroll();
				m.redraw();
			}).observe(vnode.dom.querySelector('.font-items-scroller'), {childList: true});

			onscroll();
		},
		view: function(vnode) {
			scroll = (() => {
				const scroller = document.querySelector('.font-items-scroller');
				if (!scroller) return false;
				return scroller.scrollWidth > scroller.offsetWidth;
			})();
			return m('div.font-items',
				scroll && scrollState !== 'start' ? m('button.scroll-left-button', {onclick: scrollToStart}, '◁') : '',
				m('div.font-items-scroller', {onscroll},
					Fonts.list.map(font => {
						return m(FontItem, {key: font.id, font: font})
					})
				),
				scroll && scrollState !== 'end' ? m('button.scroll-right-button', {onclick: scrollToEnd}, '▷') : '',
			)
		}
	}
}
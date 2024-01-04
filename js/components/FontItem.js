import { Fonts } from '../Fonts.js';
import { IconSpinning } from './IconSpinning.js';

export function FontItem(initialVnode) {
	return {
		view: function(vnode) {
			return m('div', {class: `font-item ${vnode.attrs.font.isLoading ? 'loading' : ''}`, id: vnode.attrs.key},
				m('span', {class: 'font-item-label'}, vnode.attrs.font.name),
				vnode.attrs.font.isLoading ? 
				m(IconSpinning) : 
				m('button.font-item-remove', {onclick: () => { Fonts.remove(vnode.attrs.font); }}, '❌'),
			)
		}
	}
}
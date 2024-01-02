import { SVG } from "./SVG.js";
import { FontInput } from "./FontInput.js";
import { DarkModeButton } from "./DarkModeButton.js";

export function Header(initialVnode) {
	return {
		view: function(vnode) {
			return m('header.header',
				m('h1.logo',
					m(SVG, {src: 'svg/logo.svg'}), 
					m('span', 'Stack & Justify')
					),
				m(FontInput),
				m('div.header-btns',
					m(DarkModeButton),
					m('button.about-btn', {onclick: () => vnode.attrs.AppState.showAbout = !vnode.attrs.AppState.showAbout }, "❓"),
					)
				)
		}
	}
}
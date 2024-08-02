import { AppState } from "../AppState.js";
import { SVG } from "./SVG.js";
import { FontInput } from "./FontInput.js";
import { DarkModeButton } from "./DarkModeButton.js";
import { Options} from "./Options.js";
import { FeaturesSelect } from "./FeaturesSelect.js";

export function Header(initialVnode) {
	return {
		view: function(vnode) {
			return m('header.header',
				m('h1.logo',
					m(SVG, {src: 'svg/logo.svg'}), 
					m('span', 'Stack & Justify')
					),
				m(FontInput),
				m(Options),
				m(FeaturesSelect),
				m('div.header-btns',
					m(DarkModeButton),
					m('button.about-btn', {onclick: () => AppState.showAbout = !AppState.showAbout }, AppState.showAbout ? "❎" : "❓"),
					)
				)
		}
	}
}
import { AppState } from "../AppState.js";
import { SVGAnimation } from "./SVGAnimation.js";

export function About(initialVnode) {
	return {
		view: function(vnode) {
			return m('section.about', {class: AppState.showAbout ? 'open' : ''},
				m(SVGAnimation, {src: 'svg/stack-and-justify-animation.svg', frames: 75}),
				m('div.about-text', 
					m('p.t-big', 
						m('em.bold', "Stack & Justify"),
						m('span', " is a tool to help create type specimens by finding words or phrases of the same width. It is free to use and distributed under GPLv3 license.")
					),
					m('p.t-big', "Font files are not uploaded, they remain stored locally in your browser."),
					m('p.t-big', 
						m('span', "For a similar tool, also check "),
						m('a.big-link', {target: '_blank', href: "https://workshop.mass-driver.com/waterfall"}, "Mass Driver’s Waterfall"),
						m('span', " from which this tool was inspired.")
					),
					m('p.col-1',
						m('span', "If you want to support this project, you can make a donation via Paypal"),
						m('br'),
						m('a.t-big.donation-btn', {target: '_blank', href: "https://www.paypal.com/donate/?hosted_button_id=677KMWSBSRL3N"}, "Donate")
					),
				),
			)
		}
	}
}
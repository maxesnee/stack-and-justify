import { SVGAnimation } from "./SVGAnimation.js";

export function SplashScreen(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.splash-screen',
				m('div.splash-screen-text',
					m(SVGAnimation, {src: 'svg/font-files-animation.svg', frames: 18}),
					m('p.t-big', 'To start, drop one or more font files anywhere on the window.'),
					m('p.splash-screen-notice', 'You fonts aren’t uploaded, they stay cached locally in your browser only.')
				)
			)
		}
	}
}
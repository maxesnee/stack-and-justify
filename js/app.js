import { AppState } from "./AppState.js";
import { Fonts } from "./Fonts.js";
import { Header } from "./components/Header.js";
import { Footer } from "./components/Footer.js";
import { About } from "./components/About.js";
import { DropZone } from "./components/DropZone.js";
import { Specimen } from "./components/Specimen.js";
import { SplashScreen } from "./components/SplashScreen.js";

const root = document.querySelector('#app');

const App = {
	view: function(vnode) {
		return [
			m(Header, {AppState}),
			m(DropZone),
			m('main.main',			
				Fonts.list.length ? m(Specimen) : m(SplashScreen),
				m(About, {AppState})
			),
			m(Footer)
		]
	}
}

m.mount(root, App);
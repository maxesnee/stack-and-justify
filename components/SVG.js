export function SVG(initialVnode) {
	return {
		oninit: function(vnode) {
			fetch(vnode.attrs.src)
			.then(response => response.text())
			.then(svgStr =>{
				const parser = new DOMParser();
				const svg = parser.parseFromString(svgStr, 'image/svg+xml').childNodes[0];
				vnode.dom.replaceWith(svg);
			})

		},
		view: function(vnode) {
			return m('div.svg');
		}
	}
}
export function SVGAnimation(initialVnode) {
	function animate(svg, frames) {
		const fps = 12;
		let start;
		let lastFrameCount = 0;
		requestAnimationFrame(step);

		function step(timestamp) {
			if (start === undefined) start = timestamp;
			const elapsed = timestamp - start;
			const frameCount = Math.floor(elapsed / (1000/fps))%frames;
			if (frameCount !== lastFrameCount) {
				svg.children[lastFrameCount].setAttribute('display', 'none');
				svg.children[frameCount].setAttribute('display', 'block');
			}

			lastFrameCount = frameCount;
			requestAnimationFrame(step);
		}
	}

	return {
		oninit: function(vnode) {
			fetch(vnode.attrs.src)
			.then(response => response.text())
			.then(svgStr => {
				const parser = new DOMParser();
				const svg = parser.parseFromString(svgStr, 'image/svg+xml').childNodes[0];
				vnode.dom.replaceWith(svg);
				animate(svg, vnode.attrs.frames);
			})
		},
		view: function(vnode) {
			return m('div.svg-animation');
		}
	}
}
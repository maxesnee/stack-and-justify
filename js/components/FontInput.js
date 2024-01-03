export function FontInput(initialVnode) {
	return {
		oncreate: function(vnode) {
			const input = vnode.dom.querySelector('input[type="file"');
			vnode.dom.querySelector('a').addEventListener('click', (e) => {
				e.preventDefault();
				input.click();
			});

			input.addEventListener('change', (e) => {
				let files = input.files;
				
				Array.from(files).forEach(file => {
					handleFontFile(file, function(fontName, fontData) {
						Fonts.add(Font(fontName, fontData));
					});
				});
			});
		},
		view: function(vnode) {
			return m('form.drop-message',
				m('input', {type: 'file', id:'uploader', multiple:'multiple', accept: 'font/otf, font/ttf, font/woff, font/woff2, .otf, .ttf, .woff, .woff2', style:{display: 'none'}}),
				m('span', 'Drop your fonts anywhere or '),
				m('label', {for: 'file-upload'}, 
					m('a', 'browse your computer ↗')
				)
			)
		}
	}
}
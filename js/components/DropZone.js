import { handleFontFiles } from "../Helpers.js";
import { Fonts } from "../Fonts.js";
import { Font } from "../Font.js";

export function DropZone(initialVnode) {
	return {
		oncreate: function(vnode) {
			let lastTarget = null;

			window.addEventListener('dragover', function(e) {
				e.preventDefault();
				e.dataTransfer.dropEffect = "copy";
			});

			window.addEventListener('dragenter', function(e) {
				lastTarget = e.target;
				e.dataTransfer.effectAllowed = "copy";
				vnode.dom.classList.add('active');
			});

			window.addEventListener('dragleave', function(e) {
				if(e.target === lastTarget || e.target === document) {
					vnode.dom.classList.remove('active');	
				}
			});

			vnode.dom.addEventListener('drop', function(e) {
				e.preventDefault();

				let files = e.dataTransfer.files;

				handleFontFiles(files, function(fontName, fontData) {
					Fonts.add(fontName, fontData);
				});
				
				vnode.dom.classList.remove('active');
			});
		},
		view: function(vnode) {
			return m('div.drop-zone')
		}
	}
}
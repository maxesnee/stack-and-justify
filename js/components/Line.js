import { SizeInput } from "./SizeInput.js";
import { FontSelect } from "./FontSelect.js";
import { CaseSelect } from "./CaseSelect.js";
import { CopyButton } from "./CopyButton.js";
import { UpdateButton } from "./UpdateButton.js";
import { DeleteButton } from "./DeleteButton.js";
import { Fonts } from "../Fonts.js";
import { Features } from "../Features.js";
import { Layout } from "../Layout.js";

export function Line(initialVnode) {
	return {
		view: function(vnode) {
			let line = vnode.attrs.line;
			return m('div', {class: 'specimen-line', id: line.id},
				m('div.line-left-col',
					m(SizeInput, {params: line}),
					Fonts.list.length ? m(FontSelect, {params: line}) : ''
					),
				m('div.line-middle-col',
					m('div.text', {style: {
						whiteSpace: "nowrap",
						fontSize: Layout.sizeLocked ? Layout.size.get() : line.size.get(),
						width: Layout.width.get(),
						fontFamily: Layout.fontLocked ? Layout.font ? Layout.font.fontFaceName : '' : line.font.fontFaceName,
						height: Layout.sizeLocked ? (Layout.size.getIn('px') * 1.2)+'px' : (line.size.getIn('px') * 1.2)+'px', // Get the line height
						fontFeatureSettings: line.featuresCSS
					}, }, line.text),
					line.text === '' ? m('div.no-words-found', 'No words found ☹') : '',
					m('div.loading', {class: line.font.isLoading ? 'visible' : 'hidden'},
						m('span', "Loading"),
						m('div.icon-spinning', "◌")
					)
				),
				m('div.line-right-col',
					m(CaseSelect, {params: line}),
					m(CopyButton, {onclick: line.copyText}),
					m(UpdateButton, {onclick: line.update}),
					m(DeleteButton, {onclick: line.remove})
				)
			);
		}
	}
}
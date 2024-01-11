import { SizeInput } from "./SizeInput.js";
import { FontSelect } from "./FontSelect.js";
import { CaseSelect } from "./CaseSelect.js";
import { CopyButton } from "./CopyButton.js";
import { UpdateButton } from "./UpdateButton.js";
import { DeleteButton } from "./DeleteButton.js";
import { Fonts } from "../Fonts.js";
import { Layout } from "../Layout.js";

export function Line(initialVnode) {
	return {
		view: function(vnode) {
			let line = vnode.attrs.line;
			return m('div', {class: 'specimen-line'},
				m('div.line-left-col',
					m(SizeInput, {params: line}),
					Fonts.list.length ? m(FontSelect, {params: line}) : ''
					),
				m('div.line-middle-col',
					line.font.isLoading ?
					m('div', {class: 'loading', style: {
						height: (line.size.getIn('px') * 1.2)+'px' // Get the line height
					}},
						m('span', "Loading"),
						m('div.icon-spinning', "◌")
					)
					: m('div', {class: 'text', style: {
						whiteSpace: "nowrap",
						fontSize: Layout.sizeLocked ? Layout.size.get() : line.size.get(),
						width: Layout.width.get(),
						fontFamily: Layout.fontLocked ? Layout.font?.fontFaceName : line.font.fontFaceName,
						
					}}, line.text),
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
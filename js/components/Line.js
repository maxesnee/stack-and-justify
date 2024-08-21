import { SizeInput } from "./SizeInput.js";
import { FontSelect } from "./FontSelect.js";
import { FilterSelect } from "./FilterSelect.js";
import { CopyButton } from "./CopyButton.js";
import { UpdateButton } from "./UpdateButton.js";
import { DeleteButton } from "./DeleteButton.js";
import { Layout } from "../Layout.js";

export function Line(initialVnode) {
	return {
		view: function(vnode) {
			let line = vnode.attrs.line;
			return m('div', {class: 'specimen-line', id: line.id},
				m('div.line-left-col',
					m(SizeInput, {params: line}),
					m(FontSelect, {params: line})
				),
				m('div.line-middle-col',
					m('div.text', {
						class: !line.outputFont.val.isLoading ? 'visible' : 'hidden',
						style: {
							whiteSpace: "nowrap",
							fontSize: line.outputSize.val+'px',
							width: Layout.width.get(),
							fontFamily: line.outputFont.val.fontFaceName,
							height: (line.outputSize.val * 1.2)+'px', // Get the line height
							fontFeatureSettings: line.outputFont.val.fontFeatureSettings.val
					}, }, line.text.val),
					!line.outputFont.val.isLoading && line.text.val === '' ? m('div.no-words-found', 'No words found ☹') : '',
					m('div.loading', {class: line.outputFont.val.isLoading ? 'visible' : 'hidden'},
						m('span', "Loading"),
						m('div.icon-spinning', "◌")
					)
				),
				m('div.line-right-col',
					m(FilterSelect, {params: line}),
					m(CopyButton, {onclick: line.copyText}),
					m(UpdateButton, {onclick: line.update}),
					m(DeleteButton, {onclick: line.remove})
				)
			);
		}
	}
}
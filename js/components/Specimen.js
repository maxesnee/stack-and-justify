import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";
import { FontItems } from "./FontItems.js";
import { Line } from "./Line.js";
import { LineCount } from "./LineCount.js";
import { SizeInputGlobal } from "./SizeInputGlobal.js";
import { FontSelectGlobal } from "./FontSelectGlobal.js";
import { WidthInput } from "./WidthInput.js";
import { CaseSelectGlobal } from "./CaseSelectGlobal.js";
import { CopyButtonGlobal } from "./CopyButtonGlobal.js";
import { UpdateButtonGlobal } from "./UpdateButtonGlobal.js";
import { NewLineButton } from "./NewLineButton.js";
import { DeleteButtonGlobal } from "./DeleteButtonGlobal.js";

export function Specimen(initialVnode) {
	return {
		oninit: function(vnode) {
			Layout.clear();
			Layout.addLine('60pt');
			Layout.addLine('60pt');
		},
		view: function(vnode) {
			return m('div', {class: 'specimen'},
				m('header.specimen-header',
					m('div.line-left-col',
						m(SizeInputGlobal),
						Fonts.list.length ? m(FontSelectGlobal) : ''
					),
					m('div.line-middle-col',
						m(WidthInput)
					),
					m('div.line-right-col',
						m(CaseSelectGlobal),
						m(CopyButtonGlobal, {onclick: Layout.copyText}),
						m(UpdateButtonGlobal, {onclick: Layout.update}),
						m(DeleteButtonGlobal, {onclick: Layout.clear})
					),
				),
				m('div.specimen-body',
					Layout.lines.map((line) => m(Line, {line})),
					m(NewLineButton)
				)
			)
		}
	}
}
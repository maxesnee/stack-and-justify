import { Layout } from "../Layout.js";
import { Fonts } from "../Fonts.js";
import { FontItems } from "./FontItems.js";
import { Line } from "./Line.js";
import { WordsSelect } from "./WordsSelect.js";
import { LineCount } from "./LineCount.js";
import { SizeInputGlobal } from "./SizeInputGlobal.js";
import { FontSelectGlobal } from "./FontSelectGlobal.js";
import { WidthInput } from "./WidthInput.js";
import { CaseSelectGlobal } from "./CaseSelectGlobal.js";
import { CopyButton } from "./CopyButton.js";
import { UpdateButton } from "./UpdateButton.js";

export function Specimen(initialVnode) {
	return {
		oninit: function(vnode) {
			Layout.reset();
			Layout.addLine('60pt');
			Layout.addLine('60pt');
		},
		view: function(vnode) {
			return m('div', {class: 'specimen'},
				m('header.specimen-header',
					m(FontItems),
					m('div.specimen-header-controls',
						m(WordsSelect),
						m(LineCount)
						)
					),
				m('div.specimen-body', 
						m('div.line-left-col',
							m(SizeInputGlobal),
							Fonts.list.length ? m(FontSelectGlobal) : ''
						),
						m('div.line-middle-col',
							m(WidthInput)
						),
						m('div.line-right-col',
							m(CaseSelectGlobal),
							m(CopyButton, {onclick: Layout.copyText}),
							m(UpdateButton, {onclick: Layout.update})
						),
					Layout.lines.map((line) => m(Line, {line}))
				)
			)
		}
	}
}
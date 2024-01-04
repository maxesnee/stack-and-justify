import { Layout } from "../Layout.js";

export function LineCount(initialVnode) {
	return {
		view: function(vnode) {
			return m('div.line-count',
				m('label.line-count-label', {for: 'line-count'}, 'Lines'),
				m('button', {onclick: () => Layout.removeLine() }, '－'),
				m('input.line-count-input', {type: 'number', id: 'line-count', value: Layout.lines.length, min: 1, max: 99, onchange: (e) => Layout.setLineCount(e.currentTarget.value)}),
				m('button', {onclick: () => Layout.addLine() }, '＋')
				)
		}
	}
}
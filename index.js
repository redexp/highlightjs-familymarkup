const Parser = require('tree-sitter');
const Fml = require('tree-sitter-familymarkup');
const {readFileSync} = require('fs');
const {join} = require('path');
const queries = (
	require.resolve('tree-sitter-familymarkup')
	.replace(
		/tree-sitter-familymarkup.+$/,
		join('tree-sitter-familymarkup', 'queries', 'highlights.scm')
	)
);

/**
 * @param {string} text
 * @param {import('./index').Params} [params]
 * @returns {{html?: string, ast?: import('hast').ElementContent[]}}
 */
module.exports = function highlight(text, params = {}) {
	const parser = ensureParser();
	const tree = parser.parse(text);
	const q = ensureQuery();
	const list = uniqCaptures(q.captures(tree.rootNode));

	let html = '';
	const ast = [];

	convert(text, list, params, function (type, value, className) {
		if (params.html) {
			html += toHtml(type, value, className.join(' '));
		}

		if (params.ast) {
			ast.push(toAst(type, value, className));
		}
	});

	return {html, ast};
};

/**
 * @returns {import('tree-sitter')}
 */
function ensureParser() {
	let {parser} = ensureParser;

	if (!parser) {
		parser = ensureParser.parser = new Parser();
		parser.setLanguage(Fml);
	}

	return parser;
}

function ensureQuery() {
	let {q} = ensureQuery;

	if (!q) {
		q = ensureQuery.q = new Parser.Query(Fml, readFileSync(queries, 'utf8'));
	}

	return q;
}

/**
 * @param {import('tree-sitter').QueryCapture[]} captures
 * @returns {import('tree-sitter').QueryCapture[]}
 */
function uniqCaptures(captures) {
	return captures.filter((cur, i) => {
		if (cur.node.isMissing) return false;

		const next = captures[i + 1];

		if (!next) return true;

		return cur.node.startIndex !== next.node.startIndex;
	});
}

/**
 * @param {string} src
 * @param {import('tree-sitter').QueryCapture[]} captures
 * @param {import('./index').ClassNameParams} params
 * @param {function("text" | "span", string, Array<string>?)} cb
 */
function convert(src, captures, params, cb) {
	let curIndex = 0;

	for (const capture of captures) {
		const className = getClassName(capture.name, params);
		const {startIndex: start, endIndex: end} = capture.node;
		const content = src.slice(start, end);

		if (curIndex < start) {
			cb('text', src.slice(curIndex, start), []);
		}

		cb('span', content, className);

		curIndex = end;
	}

	const last = src.slice(curIndex);

	if (last.length > 0) {
		cb('text', last, []);
	}
}

/**
 * @param {"text" | "span"} type
 * @param {string} text
 * @param {string} className
 * @returns {string}
 */
function toHtml(type, text, className) {
	return (
		type === 'span' ?
			`<span class="${className}">${text}</span>` :
			text
	);
}

/**
 * @param {"text" | "span"} type
 * @param {string} value
 * @param {string[]} className
 * @returns {import('hast').ElementContent}
 */
function toAst(type, value, className) {
	if (type === 'text') {
		return {
			type,
			value,
		};
	}

	return {
		type: 'element',
		tagName: type,
		properties: {
			className
		},
		children: [{
			type: 'text',
			value,
		}],
	};
}

/** @type {Map<string, string[]>} */
const typesMap = new Map();

/**
 * @param {string} type
 * @param {import('./index').ClassNameParams} [params]
 * @returns {string[]}
 */
function getClassName(type, params = {}) {
	const {classPrefix = '', modifiers = true, classMap} = params;

	if (classMap?.hasOwnProperty(type)) {
		const className = classMap[type];

		return Array.isArray(className) ? className : [className];
	}

	const key = type + ':' + classPrefix + ':' + modifiers;

	if (typesMap.has(key)) {
		return typesMap.get(key);
	}

	let list = type.split('.');

	if (!modifiers) {
		list = [list[0]];
	}

	if (classPrefix) {
		list = list.map(t => classPrefix + t);
	}

	typesMap.set(type, list);

	return list;
}
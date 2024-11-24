const Parser = require('tree-sitter');
const Fml = require('tree-sitter-familymarkup');
const {readFileSync} = require('fs');
const {resolve} = require('path');
const queries = resolve(__dirname, 'node_modules/tree-sitter-familymarkup/queries/highlights.scm');

/**
 * @param {string} text
 * @param {import('./index').Params} [params]
 * @returns {string}
 */
module.exports = function highlight(text, params = {}) {
	const parser = ensureParser();
	const tree = parser.parse(text);
	const q = ensureQuery();
	const list = q.captures(tree.rootNode);

	return convert(text, uniqCaptures(list), params);
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
 * @param {import('./index').Params} [params]
 * @returns {string}
 */
function convert(src, captures, params = {}) {
	let result = '';
	let curIndex = 0;

	for (const capture of captures) {
		const className = getClassName(capture.name, params);
		const {startIndex: start, endIndex: end} = capture.node;
		const content = src.slice(start, end);

		result += src.slice(curIndex, start) + `<span class="${className}">${content}</span>`;

		curIndex = end;
	}

	result += src.slice(curIndex);

	return result;
}

/** @type {Map<string, string>} */
const typesMap = new Map();

/**
 * @param {string} type
 * @param {import('./index').Params} [params]
 * @returns {string}
 */
function getClassName(type, params = {}) {
	const {classPrefix = '', modifiers = true} = params;
	const key = type + ':' + classPrefix + ':' + modifiers;

	if (typesMap.has(key)) {
		return typesMap.get(key);
	}

	let list = type.split('.');

	if (!modifiers) {
		list = [list[0]];
	}

	list = list.map(t => classPrefix + t).join(' ');

	typesMap.set(type, list);

	return list;
}
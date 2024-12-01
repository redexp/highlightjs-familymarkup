import Parser from 'web-tree-sitter';
import queries from './queries.json' assert {type: "json"};
import highlight from './highlight.js';

let parser;
let query;

/**
 * @param {string} text
 * @param {import('./index').Params} [params]
 * @returns {import('./index').Result}
 */
export default function (text, params = {}) {
	if (!parser) {
		throw new Error('call await init() first');
	}

	return highlight(text, {
		parser,
		query,
		...params,
	});
}

/**
 * @param {import('./index').InitParams} [params]
 * @returns {Promise<void>}
 */
export async function init(params = {}) {
	await Parser.init({
		locateFile: params.locateTreeSitterWasm
	});

	let wasmFile = 'tree-sitter-familymarkup.wasm';

	if (params.locateFamilyMarkupWasm) {
		wasmFile = params.locateFamilyMarkupWasm(wasmFile);
	}

	const FML = await Parser.Language.load(wasmFile);

	parser = new Parser();
	parser.setLanguage(FML);

	query = FML.query(queries.highlights);
}

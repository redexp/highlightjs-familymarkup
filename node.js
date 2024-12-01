const Parser = require('tree-sitter');
const FML = require('tree-sitter-familymarkup');
const highlight = require('./highlight');
const queries = require('./queries.json');

let parser;
let query;

/**
 * @param {string} text
 * @param {import('./index').Params} [params]
 * @returns {import('./index').Result}
 */
module.exports = function (text, params) {
	if (!parser) {
		init();
	}

	return highlight(text, {
		parser,
		query,
		...params
	});
};

function init() {
	parser = new Parser();
	parser.setLanguage(FML);

	query = new Parser.Query(FML, queries.highlights);
}

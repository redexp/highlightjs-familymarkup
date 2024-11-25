const {default: expect} = require('expect');
const highlight = require('../index');

describe('fml', function () {
	it('classPrefix, modifiers, html', function () {
		const src = `
Fam
// test * test #

Name + ? =
 * test2 // test # test
Name2
# test 3 // test * test
`;

		const target = `
<span class="hljs-class">Fam</span>
<span class="hljs-comment">// test * test #</span>

<span class="hljs-property">Name</span> <span class="hljs-operator">+</span> <span class="hljs-string">?</span> <span class="hljs-operator">=</span>
 <span class="hljs-comment">* test2 // test # test</span>
<span class="hljs-property">Name2</span>
<span class="hljs-comment"># test 3 // test * test</span>
`;

		const {html} = highlight(src, {classPrefix: 'hljs-', modifiers: false, html: true});

		expect(html).toEqual(target);
	});

	it('ast, classMap', function () {
		const src = `
Fam
// test

Name + ? = test
Name2
* test
girl?
`;

		const {ast} = highlight(src.trim(), {
			ast: true,
			classMap: {
				'class.declaration.family_name': 'class-name'
			},
		});

		expect(ast).toEqual([
			{
				"type": "element",
				"tagName": "span",
				"properties": {
					"className": [
						"class-name",
					]
				},
				"children": [
					{
						"type": "text",
						"value": "Fam"
					}
				]
			},
			{
				"type": "text",
				"value": "\n"
			},
			{
				"type": "element",
				"tagName": "span",
				"properties": {
					"className": [
						"comment"
					]
				},
				"children": [
					{
						"type": "text",
						"value": "// test"
					}
				]
			},
			{
				"type": "text",
				"value": "\n\n"
			},
			{
				"type": "element",
				"tagName": "span",
				"properties": {
					"className": [
						"property",
						"static",
						"name",
						"ref"
					]
				},
				"children": [
					{
						"type": "text",
						"value": "Name"
					}
				]
			},
			{
				"type": "text",
				"value": " "
			},
			{
				"type": "element",
				"tagName": "span",
				"properties": {
					"className": [
						"operator",
						"sources",
						"join"
					]
				},
				"children": [
					{
						"type": "text",
						"value": "+"
					}
				]
			},
			{
				"type": "text",
				"value": " "
			},
			{
				"type": "element",
				"tagName": "span",
				"properties": {
					"className": [
						"string",
						"unknown"
					]
				},
				"children": [
					{
						"type": "text",
						"value": "?"
					}
				]
			},
			{
				"type": "text",
				"value": " "
			},
			{
				"type": "element",
				"tagName": "span",
				"properties": {
					"className": [
						"operator",
						"arrow"
					]
				},
				"children": [
					{
						"type": "text",
						"value": "="
					}
				]
			},
			{
				"type": "text",
				"value": " "
			},
			{
				"type": "element",
				"tagName": "span",
				"properties": {
					"className": [
						"string",
						"label"
					]
				},
				"children": [
					{
						"type": "text",
						"value": "test"
					}
				]
			},
			{
				"type": "text",
				"value": "\n"
			},
			{
				"type": "element",
				"tagName": "span",
				"properties": {
					"className": [
						"property",
						"declaration",
						"static",
						"name",
						"def"
					]
				},
				"children": [
					{
						"type": "text",
						"value": "Name2"
					}
				]
			},
			{
				"type": "text",
				"value": "\n"
			},
			{
				"type": "element",
				"tagName": "span",
				"properties": {
					"className": [
						"comment"
					]
				},
				"children": [
					{
						"type": "text",
						"value": "*"
					}
				]
			},
			{
				"type": "element",
				"tagName": "span",
				"properties": {
					"className": [
						"punctuation",
						"delimiter",
						"targets"
					]
				},
				"children": [
					{
						"type": "text",
						"value": " test\ngirl"
					}
				]
			},
			{
				"type": "element",
				"tagName": "span",
				"properties": {
					"className": [
						"string",
						"unknown"
					]
				},
				"children": [
					{
						"type": "text",
						"value": "?"
					}
				]
			}
		]);
	});
});
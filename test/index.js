const {default: expect} = require('expect');
const highlight = require('../index');

describe('fml', function () {
	it('comments', function () {
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

	it('unknown', function () {
		const src = `
Fam

Name + ? =
Name2
girl?

Name + Some Name? =
Name2
?
`;

		const target = `
<span class="class declaration family_name">Fam</span>

<span class="property static name ref">Name</span> <span class="operator sources join">+</span> <span class="string unknown">?</span> <span class="operator arrow">=</span>
<span class="property declaration static name def">Name2</span>
<span class="string unknown">girl?</span>

<span class="property static name ref">Name</span> <span class="operator sources join">+</span> <span class="string unknown">Some Name?</span> <span class="operator arrow">=</span>
<span class="property declaration static name def">Name2</span>
<span class="string unknown">?</span>
`;

		const {html} = highlight(src, {ast: true, html: true});

		expect(html).toEqual(target);
	});
});
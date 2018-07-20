import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | search-bar', function(hooks) {
  setupRenderingTest(hooks);

  let datasets = [
    { id: '1', title: 'Households with Kids' },
    { id: '2', title: 'Households without Kids' },
  ];

  test('it renders', async function(assert) {
    this.set('searchables', datasets)

    await render(hbs`
      {{search-bar records=searchables class="lift"}}
    `);

    assert.equal(this.element.children[0].children[0].placeholder, 'Search 2 datasets ...');
  });
});

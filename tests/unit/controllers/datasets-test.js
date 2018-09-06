import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | datasets', function(hooks) {
  setupTest(hooks);

  test('should download metadata on downloadMetadata action', function(assert) {
    assert.expect(4);

    // get the controller instance
    let controller = this.owner.lookup('controller:posts');

    // check the properties before the action is triggered
    assert.equal(controller.get('propA'), 'You need to write tests', 'propA initialized');
    assert.equal(controller.get('propB'), 'And write one for me too', 'propB initialized');

    // trigger the action on the controller by using the `send` method,
    // passing in any params that our action may be expecting
    controller.send('setProps', 'Testing Rocks!');

    // finally we assert that our values have been updated
    // by triggering our action.
    assert.equal(controller.get('propA'), 'Testing is cool', 'propA updated');
    assert.equal(controller.get('propB'), 'Testing Rocks!', 'propB updated');
  });
});

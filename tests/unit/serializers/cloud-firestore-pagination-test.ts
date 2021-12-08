import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | cloud firestore pagination', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const serializer = store.serializerFor('cloud-firestore-pagination');

    assert.ok(serializer);
  });

  test('it serializes records', function (assert) {
    const store = this.owner.lookup('service:store');
    const record = store.createRecord('cloud-firestore-pagination', {});

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});

ember-cloud-firestore-adapter-pagination
==============================================================================

This addon automatically adds cursor pagination data to the `meta` object inside the `DS.PromiseArray` object returned by `store.query`.

```javascript
meta = {
  canNext: true,
  canPrevious: false,
};
```

It works by checking if a `limit()` filter is included in the Cloud Firestore query. If this limit is present, the adapter fetches `LIMIT + 1` records, and depending on the presence of that extra record, `canNext` and `canPrevious` are assigned boolean values.

Why does this addon exist? It's a major PITA having to copy a pagination strategy on every route in your app that needs pagination (theoretically, with time, this would be pretty much every single route in your app). With this addon, you can make a super minimal `store.query()` call and get all the pagination data you need every time.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v12 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-cloud-firestore-adapter-pagination
```


Usage
------------------------------------------------------------------------------

```javascript
// app/adapters/application.js

import CloudFirestoreAdapterPagination from 'ember-cloud-firestore-adapter-pagination/adapters/cloud-firestore-pagination';

export default class ApplicationAdapter extends CloudFirestoreAdapterPagination {}
```

```javascript
// app/serializers/application.js

import CloudFirestoreSerializerPagination from 'ember-cloud-firestore-adapter-pagination/serializers/cloud-firestore-pagination';

export default class ApplicationSerializer extends CloudFirestoreSerializerPagination {}
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).

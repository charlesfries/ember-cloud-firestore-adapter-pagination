ember-cloud-firestore-adapter-pagination
==============================================================================

This addon automatically adds cursor pagination data to the `meta` object inside the `DS.PromiseArray` object returned by `store.query`.

```typescript
interface Meta {
  canNext: boolean;
  canPrevious: boolean;
}
```

It works by checking if a `limit()` filter is included in the Cloud Firestore query. If this limit is present, the adapter fetches `LIMIT + 1` records, and depending on the presence of that extra record, `canNext` and `canPrevious` are assigned boolean values.


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

```javascript
// app/routes/application.js

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service store;

  model() {
    return this.store.query('post', {
      filter: (ref) => {
        return ref.limit(10);
      },
    });
  }
}
```

```hbs
{{! app/templates/application.js }}

{{#each this.model as |post|}}
  {{post.id}}
{{/each}}

<button
  disabled={{not this.model.canPrevious}}
  {{on "click" this.previous}}>
  Previous
</button>

<button
  disabled={{not this.model.canNext}}
  {{on "click" this.next}}>
  Next
</button>
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).

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

  queryParams = {
    startAfter: { refreshModel: true },
    endBefore: { refreshModel: true },
  };

  model({ startAfter, endBefore }) {
    return this.store.query('post', {
      filter: (ref) => {
        const PAGE_SIZE = 10;

        ref = ref.orderBy('createdAt', 'desc');

        if (startAfter)
          ref = ref.startAfter(startAfter);
        else if (endBefore)
          ref = ref.endBefore(endBefore).limitToLast(PAGE_SIZE);
        if (!endBefore)
          ref = ref.limit(PAGE_SIZE);

        return ref;
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
  type="button"
  disabled={{not this.model.meta.canPrevious}}
  {{on "click" this.previous}}>
  Previous
</button>

<button
  type="button"
  disabled={{not this.model.meta.canNext}}
  {{on "click" this.next}}>
  Next
</button>
```

```javascript
// app/controllers/application.js

import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked startAfter;
  @tracked endBefore;

  @action next() {
    this.startAfter = this.model.lastObject.createdAt;
    this.endBefore = undefined;
  }

  @action previous() {
    this.startAfter = undefined;
    this.endBefore = this.model.firstObject.createdAt;
  }
}
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).

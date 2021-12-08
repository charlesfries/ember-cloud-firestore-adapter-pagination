import CloudFirestoreSerializer from 'ember-cloud-firestore-adapter/serializers/cloud-firestore';

import type Store from '@ember-data/store';
import type Model from '@ember-data/model';

type Payload = any;

export default class CloudFirestorePaginationSerializer extends CloudFirestoreSerializer {
  override normalizeQueryResponse(
    store: Store,
    primaryModelClass: Model,
    payload: Payload,
    id: string | number,
    requestType: string
  ): Payload {
    const normalizedDocument = super.normalizeQueryResponse(
      store,
      primaryModelClass,
      payload.docs,
      id,
      requestType
    ) as Payload;
    normalizedDocument.meta = payload.meta;
    return normalizedDocument;
  }
}

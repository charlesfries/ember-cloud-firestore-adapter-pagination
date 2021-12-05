import CloudFirestoreAdapter from 'ember-cloud-firestore-adapter/adapters/cloud-firestore';
import RSVP from 'rsvp';

import type DS from 'ember-data';
import type Store from '@ember-data/store';
import type firebase from 'firebase/compat/app';

interface ModelClass {
  modelName: string;
}

interface AdapterOption {
  isRealtime?: boolean;
  queryId?: string;

  buildReference?(
    db: firebase.firestore.Firestore
  ): firebase.firestore.CollectionReference;
  filter?(db: firebase.firestore.CollectionReference): firebase.firestore.Query;
  include?(
    batch: firebase.firestore.WriteBatch,
    db: firebase.firestore.Firestore
  ): void;
}

export default class MyCloudFirestoreAdapter extends CloudFirestoreAdapter {
  public override query(
    _store: Store,
    type: ModelClass,
    query: AdapterOption,
    recordArray: DS.AdapterPopulatedRecordArray<unknown>
  ): RSVP.Promise<unknown> {
    return new RSVP.Promise((resolve, reject) => {
      const collectionRef = (this as any).buildCollectionRef(
        type.modelName,
        query
      );
      let firestoreQuery = query.filter?.(collectionRef) || collectionRef;

      // if a limit filter exists in the query, modify it so it fetches n + 1 records, for pagination
      const { limit, limitType, startAt, endAt } = (firestoreQuery as any)
        ._delegate._query;
      if (limit) {
        if (limitType === 'F') {
          firestoreQuery = firestoreQuery.limit(limit + 1);
        } else {
          firestoreQuery = firestoreQuery.limitToLast(limit + 1);
        }
      }

      const unsubscribe = firestoreQuery.onSnapshot(
        async (querySnapshot: any) => {
          if (query.isRealtime && !(this as any).isFastBoot) {
            (this as any).realtimeTracker?.trackQueryChanges(
              firestoreQuery,
              recordArray,
              query.queryId
            );
          }

          const meta = {
            canNext: false,
            canPrevious: false,
          };

          let { docs } = querySnapshot;
          if (limit) {
            if (startAt) {
              meta.canNext = docs.length > limit;
              meta.canPrevious = true;
              docs = docs.slice(0, limit);
            } else if (endAt) {
              meta.canNext = true;
              meta.canPrevious = docs.length > limit;
              docs = docs.length === limit ? docs : docs.slice(1).slice(-limit);
            } else {
              meta.canNext = docs.length > limit;
              meta.canPrevious = false;
              docs = docs.slice(0, limit);
            }
          }

          resolve({
            docs: docs.map((docSnapshot: any) => {
              return Object.assign(docSnapshot.data(), { id: docSnapshot.id });
            }),
            meta,
          });

          unsubscribe();
        },
        (error: any) => reject(error)
      );
    });
  }
}

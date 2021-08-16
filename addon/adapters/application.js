import CloudFirestoreAdapter from 'ember-cloud-firestore-adapter/adapters/cloud-firestore';
import RSVP from 'rsvp';

export default class MyCloudFirestoreAdapter extends CloudFirestoreAdapter {
	/**
	 * @override
	 */
	query(_store, type, query, recordArray) {
		return new RSVP.Promise((resolve, reject) => {
			const collectionRef = this.buildCollectionRef(type.modelName, query);
			let firestoreQuery = query.filter?.(collectionRef) || collectionRef;

			const { limit, startAt, endAt } = firestoreQuery._delegate._query;
			if (limit) {
				firestoreQuery = firestoreQuery.limit(limit + 1);
			}

			const unsubscribe = firestoreQuery.onSnapshot(
				async (querySnapshot) => {
					if (query.isRealtime && !this.isFastBoot) {
						this.realtimeTracker.trackQueryChanges(firestoreQuery, recordArray, query.queryId);
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
						docs: docs.map((docSnapshot) => {
							return Object.assign(docSnapshot.data(), { id: docSnapshot.id });
						}),
						meta,
					});

					unsubscribe();
				},
				(error) => reject(error)
			);
		});
	}
}

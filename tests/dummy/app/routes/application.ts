import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import type Store from '@ember-data/store';

export default class ApplicationRoute extends Route {
  @service declare store: Store;

  queryParams = {
    startAfter: { refreshModel: true },
    endBefore: { refreshModel: true },
  };

  // beforeModel() {
  //   return this.generateFakeData();
  // }

  async model({ startAfter, endBefore }: { startAfter?: Date, endBefore?: Date }) {
    return this.store.query('post', {
      filter: (ref: any) => {
        const PAGE_SIZE = 5;

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

  /**
   * These overrides convert the standard Date object to the result of valueOf, so we don't lose millisecond accuracy when QPs are serialized.
   */

  serializeQueryParam(value: Date, urlKey: string, defaultValueType: string): number {
    if (value && (urlKey === 'startAfter' || urlKey === 'endBefore')) {
      return value.valueOf();
    }
    // @ts-ignore
    return super.serializeQueryParam(value, urlKey, defaultValueType);
  }

  deserializeQueryParam(value: string, urlKey: string, defaultValueType: string): unknown {
    if (value && (urlKey === 'startAfter' || urlKey === 'endBefore')) {
      return new Date(parseInt(value));
    }
    // @ts-ignore
    return super.deserializeQueryParam(value, urlKey, defaultValueType);
  }

  /**
   * Generate fake data.
   */

  // private async generateFakeData() {
  //   const post = this.store.createRecord('post', {
  //     title: 'The Title',
  //     body: 'The Body',
  //   });
  //   await post.save();
  // }
}

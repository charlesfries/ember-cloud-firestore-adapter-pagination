import Model, { attr } from '@ember-data/model';

export default class PostModel extends Model {
  // @ts-ignore
  @attr('timestamp') declare createdAt: Date;
  @attr('string') declare title: string;
  @attr('string') declare body: string;
}

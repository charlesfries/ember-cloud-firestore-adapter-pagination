import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked startAfter?: Date;
  @tracked endBefore?: Date;

  @action next() {
    this.startAfter = this.model.lastObject.createdAt;
    this.endBefore = undefined;
  }

  @action previous() {
    this.startAfter = undefined;
    this.endBefore = this.model.firstObject.createdAt;
  }
}
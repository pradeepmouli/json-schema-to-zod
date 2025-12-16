import { BaseBuilder } from './BaseBuilder.js';

export class NeverBuilder extends BaseBuilder<NeverBuilder> {
  constructor() {
    super('z.never()');
  }
}

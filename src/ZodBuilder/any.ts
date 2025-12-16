import { BaseBuilder } from './BaseBuilder.js';

export class AnyBuilder extends BaseBuilder<AnyBuilder> {
  constructor() {
    super('z.any()');
  }
}

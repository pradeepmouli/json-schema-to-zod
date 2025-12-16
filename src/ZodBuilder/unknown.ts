import { BaseBuilder } from './BaseBuilder.js';

export class UnknownBuilder extends BaseBuilder<UnknownBuilder> {
  constructor() {
    super('z.unknown()');
  }
}

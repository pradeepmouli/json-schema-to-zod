import { BaseBuilder } from './BaseBuilder.js';

export class LiteralBuilder extends BaseBuilder<LiteralBuilder> {
  constructor(value: import('../Types.js').Serializable) {
    super(`z.literal(${JSON.stringify(value)})`);
  }
}

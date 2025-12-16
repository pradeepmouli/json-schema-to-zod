import { BaseBuilder } from './BaseBuilder.js';

export class UnionBuilder extends BaseBuilder<UnionBuilder> {
  private readonly _schemas: (BaseBuilder<any> | string)[];

  constructor(schemas: (BaseBuilder<any> | string)[] = []) {
    super('');
    this._schemas = schemas;
  }

  override text(): string {
    const parts = this._schemas.map((s) => (typeof s === 'string' ? s : s.text()));
    this._baseText = `z.union([${parts.join(', ')}])`;
    return super.text();
  }
}

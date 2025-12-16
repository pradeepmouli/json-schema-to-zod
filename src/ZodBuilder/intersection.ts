import { BaseBuilder } from './BaseBuilder.js';

export class IntersectionBuilder extends BaseBuilder<IntersectionBuilder> {
  private readonly _schemas: (BaseBuilder<any> | string)[];

  constructor(schemas: (BaseBuilder<any> | string)[] = []) {
    super('');
    this._schemas = schemas;
  }

  override text(): string {
    const parts = this._schemas.map((s) => (typeof s === 'string' ? s : s.text()));
    if (parts.length === 0) {
      this._baseText = 'z.never()';
    } else if (parts.length === 1) {
      this._baseText = parts[0];
    } else {
      // Compose intersections to match expected grouping:
      // z.intersection(a, z.intersection(b, c)) for [a, b, c]
      const foldRight = (arr: string[]): string => {
        if (arr.length === 2) {
          return `z.intersection(${arr[0]}, ${arr[1]})`;
        }
        const [head, ...tail] = arr;
        return `z.intersection(${head}, ${foldRight(tail)})`;
      };
      this._baseText = foldRight(parts);
    }
    return super.text();
  }
}

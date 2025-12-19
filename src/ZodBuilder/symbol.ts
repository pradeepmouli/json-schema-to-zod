import { ZodBuilder } from './BaseBuilder.js';

/**
 * SymbolBuilder: represents z.symbol()
 */
export class SymbolBuilder extends ZodBuilder<'symbol'> {
	readonly typeKind = 'symbol' as const;
	protected override base(): string {
		return 'z.symbol()';
	}
}

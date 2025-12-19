import { BaseBuilder } from './BaseBuilder.js';

/**
 * SymbolBuilder: represents z.symbol()
 */
export class SymbolBuilder extends BaseBuilder {
	protected override base(): string {
		return 'z.symbol()';
	}
}

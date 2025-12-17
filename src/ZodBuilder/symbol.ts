import { BaseBuilder } from './BaseBuilder.js';

/**
 * SymbolBuilder: represents z.symbol()
 */
export class SymbolBuilder extends BaseBuilder {
	constructor() {
		super();
	}

	protected override base(): string {
		return 'z.symbol()';
	}
}

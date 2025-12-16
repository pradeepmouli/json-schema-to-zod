import { parseArgs, printParams } from '../../src/utils/cliTools';
import { describe, it, expect } from 'vitest';

describe('cliTools', () => {
	it('parseArgs should handle param as optional whether false or undefined is passed', () => {
		expect(parseArgs({ test: { required: false } }, [])).toBeTruthy();
		expect(parseArgs({ test: { required: undefined } }, [])).toBeTruthy();
	});

	it('parseArgs should throw with missing required property', () => {
		let caught = false;
		try {
			parseArgs({ test: { required: true } }, []);
		} catch {
			caught = true;
		}
		expect(caught).toBeTruthy();
	});

	it('parseArgs should throw with missing required property with message', () => {
		let caught = false;
		try {
			parseArgs({ test: { required: 'Some message' } }, []);
		} catch {
			caught = true;
		}
		expect(caught).toBeTruthy();
	});

	it('printParams should handle missing description', () => {
		const log = console.log;
		let logged = false;
		console.log = () => {
			logged = true;
		};

		printParams({ test: {} });
		expect(logged).toBeTruthy();
		console.log = log;
	});

	it('parseArgs should handle help with argument passed', () => {
		let ran = false;
		let logged = false;

		const exit = process.exit;
		const log = console.log;

		// @ts-expect-error Unit testing
		process.exit = () => {
			ran = true;
		};
		console.log = () => {
			logged = true;
		};
		parseArgs({}, ['-h'], true);
		parseArgs({}, ['--help'], true);
		parseArgs({}, ['--help'], 'some help string');
		expect(ran).toBeTruthy();
		expect(logged).toBeTruthy();
		process.exit = exit;
		console.log = log;
	});
});

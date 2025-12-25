import { readdirSync, statSync } from 'fs';
import { Project, SourceFile } from 'ts-morph';

const ignore = [
	'src/index.ts',
	'src/cli.ts',
	'src/utils/cliTools.ts',
	'src/JsonSchema/index.ts',
	'src/JsonSchema/jsonSchemaToZod.ts',
];

function checkSrcDir(path: string): string[] {
	const exports: string[] = [];

	for (const item of readdirSync(path)) {
		const itemPath = path + '/' + item;

		if (ignore.includes(itemPath)) {
			continue;
		}

		if (statSync(itemPath).isDirectory()) {
			exports.push(...checkSrcDir(itemPath));
		} else if (item.endsWith('.ts')) {
			exports.push('./' + itemPath.slice(4, -2) + 'js');
		}
	}

	return exports;
}

const exportPaths = checkSrcDir('src');

// Create a new project and source file using ts-morph
const project = new Project();
const sourceFile: SourceFile = project.createSourceFile('./src/index.ts', '', {
	overwrite: true,
});

// Add all the export statements
for (const exportPath of exportPaths) {
	// Skip jsonSchemaToZod.js for now - we'll handle it specially
	if (exportPath === './jsonSchemaToZod.js') {
		continue;
	}
	sourceFile.addExportDeclaration({
		moduleSpecifier: exportPath,
	});
}

// Export both named and default export from jsonSchemaToZod in a single statement
// This avoids the circular dependency issue
sourceFile.addExportDeclaration({
	moduleSpecifier: './jsonSchemaToZod.js',
	namedExports: [
		'jsonSchemaToZod',
		{ name: 'jsonSchemaToZod', alias: 'default' },
	],
});

// Save the file
sourceFile.saveSync();

console.log('Generated src/index.ts with ts-morph');

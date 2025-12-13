import { readdirSync, statSync } from "fs";
import { Project, SourceFile } from "ts-morph";

const ignore = ["src/index.ts", "src/cli.ts", "src/utils/cliTools.ts"];

function checkSrcDir(path: string): string[] {
  const exports: string[] = [];

  for (const item of readdirSync(path)) {
    const itemPath = path + "/" + item;

    if (ignore.includes(itemPath)) {
      continue;
    }

    if (statSync(itemPath).isDirectory()) {
      exports.push(...checkSrcDir(itemPath));
    } else if (item.endsWith(".ts")) {
      exports.push("./" + itemPath.slice(4, -2) + "js");
    }
  }

  return exports;
}

const exportPaths = checkSrcDir("src");

// Create a new project and source file using ts-morph
const project = new Project();
const sourceFile: SourceFile = project.createSourceFile(
  "./src/index.ts",
  "",
  { overwrite: true },
);

// Add all the export statements
for (const exportPath of exportPaths) {
  sourceFile.addExportDeclaration({
    moduleSpecifier: exportPath,
  });
}

// Add the import and default export at the end to maintain order
sourceFile.addImportDeclaration({
  moduleSpecifier: "./jsonSchemaToZod.js",
  namedImports: ["jsonSchemaToZod"],
});

sourceFile.addExportAssignment({
  isExportEquals: false,
  expression: "jsonSchemaToZod",
});

// Save the file
sourceFile.saveSync();

console.log("Generated src/index.ts with ts-morph");

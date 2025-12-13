import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

describe("cli", () => {
  it("runs cli (help)", () => {
    const { stdout } = spawnSync("tsx", ["src/cli.ts", "-h"], {
      encoding: "utf8",
    });
    expect(stdout.includes("--input")).toBeTruthy();
  });

  it("runs cli (input only)", () => {
    const { stderr } = spawnSync("tsx", ["src/cli.ts", "-i", "test/all.json"], {
      encoding: "utf8",
    });
    expect(!stderr).toBeTruthy();
  });

  it("runs cli (noImport)", () => {
    const { stderr } = spawnSync("tsx", ["src/cli.ts", "-i", "test/all.json", "--noImport"], {
      encoding: "utf8",
    });
    expect(!stderr).toBeTruthy();
  });

  it("runs cli (stdin only)", () => {
    const { stderr } = spawnSync("tsx", ["src/cli.ts"], {
      input: '{"type": "any"}',
      encoding: "utf8",
    });
    expect(!stderr).toBeTruthy();
  });

  it("runs cli (output)", () => {
    const { stderr } = spawnSync(
      "tsx",
      ["src/cli.ts", "--output", "test/output/output.js", "-i", "test/all.json"],
      {
        encoding: "utf8",
      },
    );
    expect(!stderr).toBeTruthy();
  });

  it("runs cli (output with depth)", () => {
    const { stderr } = spawnSync(
      "tsx",
      ["src/cli.ts", "--output", "test/output/output.js", "-i", "test/all.json", "-d", "2"],
      {
        encoding: "utf8",
      },
    );
    expect(!stderr).toBeTruthy();
  });

  it("cli should err with with missing input", () => {
    const { stderr } = spawnSync("tsx", ["src/cli.ts", "--output", "test/output/output.js"], {
      encoding: "utf8",
    });
    expect(stderr.includes("Unexpected end of JSON input")).toBeTruthy();
  });

  it("cli should err with with bad depth", () => {
    const { stderr } = spawnSync(
      "tsx",
      ["src/cli.ts", "--output", "test/output/output.js", "-i", "test/all.json", "-d", "abc"],
      {
        encoding: "utf8",
      },
    );
    expect(stderr.includes("Value of argument depth must be a valid number")).toBeTruthy();
  });

  it("cli should err with with missing depth", () => {
    const { stderr } = spawnSync(
      "tsx",
      ["src/cli.ts", "--output", "test/output/output.js", "-i", "test/all.json", "-d"],
      {
        encoding: "utf8",
      },
    );
    expect(stderr.includes("Expected a value for argument depth")).toBeTruthy();
  });

  it("cli should err with bad array value", () => {
    const { stderr } = spawnSync(
      "tsx",
      [
        "src/cli.ts",
        "--output",
        "test/output/output.js",
        "-i",
        "test/all.json",
        "-m",
        "notAModule",
      ],
      {
        encoding: "utf8",
      },
    );
    expect(stderr.includes("Value of argument module must be one of esm,cjs,none")).toBeTruthy();
  });
});

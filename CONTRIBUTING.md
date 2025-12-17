# Contributing

Hey, thanks for wanting to contribute.

Before you open a PR, make sure to open an issue and discuss the problem you want to solve. I will not consider PRs without issues.

I use [gitmoji](https://gitmoji.dev/) for my commit messages because I think it's fun. I encourage you to do the same, but won't enforce it.

I check PRs and issues very rarely so please be patient.

## Development Workflow

### Package Manager

This project uses [pnpm](https://pnpm.io/) as the package manager. To get started:

```zsh
# Install pnpm globally if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install
```

### Tests

Vitest is used for the test suite:

```zsh
pnpm exec vitest --list
pnpm exec vitest run
pnpm exec vitest
```

Or use the package scripts:

```zsh
pnpm test
pnpm dev  # runs vitest in watch mode
```

### Formatting & Linting

Use oxfmt and oxlint for formatting and linting:

```zsh
pnpm exec oxfmt --check .
pnpm exec oxfmt .
pnpm exec oxlint
```

Or use the package scripts:

```zsh
pnpm run format:check
pnpm run format
pnpm run lint
pnpm run lint:fix
```

Configs:
- `.oxfmt.json`
- `.oxlintrc.json`

### Code Generation

`createIndex.ts` builds `src/index.ts` using ts-morph AST APIs for type-safe code emission.

### Building

To build the project:

```zsh
pnpm run build
```

This will generate the CommonJS, ESM, and TypeScript declaration files in the `dist` directory.

### Versioning and Publishing

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing:

1. Create a changeset to describe your changes:
   ```zsh
   pnpm changeset
   ```

2. The CI/CD will automatically create a version PR when changesets are merged to master.

3. When the version PR is merged, the package will be automatically published to npm.

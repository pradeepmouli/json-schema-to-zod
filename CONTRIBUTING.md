# Contributing

Hey, thanks for wanting to contribute.

Before you open a PR, make sure to open an issue and discuss the problem you want to solve. I will not consider PRs without issues.

I use [gitmoji](https://gitmoji.dev/) for my commit messages because I think it's fun. I encourage you to do the same, but won't enforce it.

I check PRs and issues very rarely so please be patient.

## Development Workflow

### Tests

Vitest is used for the test suite:

```zsh
npx vitest --list
npx vitest run
npx vitest
```

### Formatting & Linting

Use oxfmt and oxlint for formatting and linting:

```zsh
npx oxfmt --check .
npx oxfmt .
npx oxlint
```

Configs:
- `.oxfmt.json`
- `.oxlintrc.json`

### Code Generation

`createIndex.ts` builds `src/index.ts` using ts-morph AST APIs for type-safe code emission.

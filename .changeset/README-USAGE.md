# How to Use Changesets

## For Contributors

When you make a change that should result in a new version being published, create a changeset:

```bash
pnpm changeset
```

This will:
1. Ask you what type of change this is (patch, minor, major)
2. Ask you to describe your changes
3. Create a new markdown file in `.changeset/` directory

Commit this changeset file along with your code changes.

## For Maintainers

When PRs with changesets are merged to `master`:

1. The Release workflow will automatically create a "Version Packages" PR
2. This PR will:
   - Bump version numbers based on changesets
   - Update CHANGELOG.md
   - Remove the consumed changeset files
3. When you merge the "Version Packages" PR, the package will automatically be published to npm

## Version Types

- **patch** (0.1.0 → 0.1.1): Bug fixes, minor improvements
- **minor** (0.1.0 → 0.2.0): New features, backward-compatible changes
- **major** (0.1.0 → 1.0.0): Breaking changes

## Example Changeset

```markdown
---
"x-to-zod": minor
---

Add support for new JSON Schema feature
```

# Migration to pnpm and CI/CD - Setup Guide

This document explains the changes made and the steps needed to complete the setup.

## What Was Changed

### 1. Package Manager Migration (npm → pnpm)
- Removed `package-lock.json`
- Added `pnpm-lock.yaml`
- Updated `.gitignore` to include pnpm-specific entries
- Updated all npm commands in `package.json` scripts to use pnpm

### 2. CI/CD Workflows

#### Updated: `.github/workflows/ci.yml`
- Added pnpm installation step using `pnpm/action-setup@v4`
- Updated Node.js setup to cache pnpm dependencies
- Changed all npm commands to pnpm equivalents

#### New: `.github/workflows/release.yml`
- Automated version bumping using Changesets
- Automated publishing to npm
- Creates "Version Packages" PRs automatically when changesets are merged to master

### 3. Version Management (Changesets)
- Added `@changesets/cli` as a dev dependency
- Created `.changeset/` directory with configuration
- Added new package.json scripts:
  - `pnpm changeset` - Create a new changeset
  - `pnpm version` - Bump versions based on changesets
  - `pnpm release` - Build and publish to npm

### 4. Documentation
- Updated `CONTRIBUTING.md` with pnpm instructions
- Added versioning and publishing workflow documentation
- Created `.changeset/README-USAGE.md` with changeset usage guide

## Required Setup (Repository Owner Action)

### 1. Add NPM_TOKEN Secret

The automated publishing workflow requires an NPM authentication token:

1. Generate an NPM token:
   - Go to https://www.npmjs.com/
   - Click on your profile → Access Tokens
   - Click "Generate New Token" → Choose "Automation" type
   - Copy the token

2. Add the token to GitHub:
   - Go to your repository on GitHub
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your NPM token
   - Click "Add secret"

### 2. Verify Workflows Are Enabled

1. Go to repository Settings → Actions → General
2. Ensure "Allow all actions and reusable workflows" is selected
3. Under "Workflow permissions", ensure "Read and write permissions" is selected
4. Check "Allow GitHub Actions to create and approve pull requests"

## How to Use (For Contributors)

### Installing Dependencies
```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install project dependencies
pnpm install
```

### Development Workflow
```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm dev

# Lint code
pnpm run lint

# Format code
pnpm run format

# Build project
pnpm run build
```

### Creating Changesets
When you make changes that should result in a version bump:

```bash
pnpm changeset
```

This will:
1. Ask you what type of change this is (patch/minor/major)
2. Ask you to describe your changes
3. Create a markdown file in `.changeset/` directory

Commit this changeset file with your code changes.

## How Publishing Works

1. **Developer workflow:**
   - Developer creates a changeset: `pnpm changeset`
   - Developer commits the changeset with their code changes
   - Developer opens a PR

2. **After PR is merged to master:**
   - The Release workflow automatically runs
   - It creates a "Version Packages" PR that:
     - Bumps version in package.json
     - Updates CHANGELOG.md
     - Removes consumed changeset files

3. **When Version Packages PR is merged:**
   - Package is automatically built
   - Package is automatically published to npm
   - A git tag is created for the new version

## Verification Steps

After merging this PR, verify the setup by:

1. Check that the CI workflow passes on master
2. Create a test changeset and merge it to master
3. Verify that a "Version Packages" PR is created automatically
4. Merge the Version Packages PR
5. Verify that the package is published to npm
6. Check that a new git tag was created

## Troubleshooting

### Publishing fails with authentication error
- Verify the NPM_TOKEN secret is set correctly
- Ensure the token has automation/publish permissions
- Check that the token hasn't expired

### Version Packages PR not created
- Check that changesets exist in the `.changeset/` directory
- Verify the Release workflow is enabled
- Check workflow runs in Actions tab for errors

### Build fails in CI
- Verify all dependencies are listed in package.json
- Check that pnpm version is compatible (v10 is installed)
- Review the workflow logs for specific errors

## Rollback Plan

If you need to revert to npm:

1. Run `npm install` to generate package-lock.json
2. Delete pnpm-lock.yaml
3. Revert changes to .github/workflows/ci.yml
4. Revert package.json scripts to use npm commands
5. Optionally remove @changesets/cli dependency
6. Optionally remove .changeset/ directory

## References

- [pnpm documentation](https://pnpm.io/)
- [Changesets documentation](https://github.com/changesets/changesets)
- [GitHub Actions documentation](https://docs.github.com/en/actions)

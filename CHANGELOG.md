# Changelog

## 0.3.0

### Minor Changes

- added preprocessor support

## 0.2.2

### Patch Changes

- oneOf now uses z.xor

## 0.2.1

### Patch Changes

- cleanup, updated function builders

## 0.2.0

### Minor Changes

- a3a450b: Add support for new JSON Schema feature

  ```

  ```

- 30ee77d: Migrate to pnpm and add CI/CD for automated version bumping and publishing

  - Migrated from npm to pnpm for package management
  - Updated CI workflow to use pnpm
  - Added automated version bumping using Changesets
  - Added automated publishing to npm via GitHub Actions
  - Updated documentation to reflect pnpm usage

- bcb2b10: enhancements

### Patch Changes

- bcb2b10: updated dependencies

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## Unreleased

### Changed

- Refactor: JSON Schema parsing and CLI boundaries now use fluent builder objects internally and call `.text()` at the top-level output boundary.
- CLI output is normalized with a trailing newline for stable file/stdout diffs.

### Fixed

- Test reliability: CLI tests no longer assume a globally available `tsx` binary.

### Added

- New fluent builder types for schema composition and primitives (e.g., union/intersection/tuple/record/any/never/unknown/literal).

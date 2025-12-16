# Changelog

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

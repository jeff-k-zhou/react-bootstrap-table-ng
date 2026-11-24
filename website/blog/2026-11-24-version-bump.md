---
title: Dependency Update & Quality Hardening Release (2026-11-24)
authors: jeff-k-zhou
---

## Changed Packages

All `react-bootstrap-table-ng` packages version bump to `5.19.7`

## Overview

This release focuses on keeping the entire `react-bootstrap-table-ng` monorepo up to date with the latest ecosystem dependencies, hardening TypeScript type safety, expanding test coverage to near-complete levels, and resolving a collection of accessibility and build-system issues uncovered during that process.

## Changelog

### Dependency Upgrades

- **Yarn**: `4.14.1` → `4.18.1`
- **Lerna**: `^9.0.7` → `^10.1.3`
- **React**: `^19.2.6` → `^19.3.1` (and `react-dom` in lockstep)
- **Babel**: `^7.28.x` → `^7.29.7` (all `@babel/*` packages)
- **Jest**: `^30.4.2` → `30.5.2`
- **Webpack**: `^5.106.2` → `^5.113.0`
- **@testing-library/jest-dom**: `^6.9.1` → `^7.0.1`
- **Bootstrap CSS**: `5.3.8` → `5.3.9` (static assets replaced accordingly)
- **Sass**: added `^1.108.2` as a new devDependency
- Various `@types/*` packages moved from `dependencies` to `devDependencies` for a cleaner consumer install

### Increased Test Coverage

A major push to close coverage gaps across the entire monorepo — 71 test files added or substantially expanded (9 500+ line insertions):

- **Core (`react-bootstrap-table-ng`)**: New and expanded tests for cell-event delegation, column formatting, filters, row expansion, row selection, sorting, and store operations
- **Filter (`react-bootstrap-table-ng-filter`)**: Full unit coverage for all filter types (text, number, date, select, custom)
- **Paginator (`react-bootstrap-table-ng-paginator`)**: Edge-case and extra-coverage tests for all pagination controls
- **Overlay (`react-bootstrap-table-ng-overlay`)**: Loading overlay style and behaviour tests
- **Editor (`react-bootstrap-table-ng-editor`)**: Cell edit lifecycle and validation tests
- **Toolkit (`react-bootstrap-table-ng-toolkit`)**: Search, column toggle, and CSV export tests

### TypeScript Type Improvements

- **`RowProps`** (`should-updater.ts`): `clickToEdit` and `dbclickToEdit` now accept `boolean | string` (previously typed as `string` only); added an index signature so arbitrary row-level props pass the type checker cleanly.
- **`FilterProps`** (`filters-cell.tsx`): The `Filter` property is now optional, removing a spurious "required prop missing" error when no column filter is configured. The JSX render path was also refactored to use a typed local variable so TypeScript correctly narrows the callable component type.
- **`SelectFilterOptions`** (`filter/src/const.ts`): The `value` field in the array variant now accepts `number | string` (previously `number` only), matching real-world usage.
- **`LoadingOverlayStyles`** (`loading-overlay.tsx`): Every style property now accepts a plain `React.CSSProperties` object in addition to the existing function form, eliminating type errors for users who pass static style objects.
- **`PaginationDataProviderProps`** (`paginator/index.tsx`): `onPageChange` is now optional, reflecting that internal state can manage pagination without a consumer-supplied callback.

### Build System Fix

- **`tsconfig.json`**: Added `"./packages/**/test"` to the `exclude` array so test files are never compiled into package distributions. This eliminated 110+ spurious TypeScript errors that surfaced when `tsc --noEmit` traversed test directories.

### Accessibility Fixes

- **Pagination button labels** (`Pagination.stories.tsx`, `Pagination.tsx`): Corrected swapped `aria-label` values on the First / Previous / Next pagination buttons so the accessible name matches the visible control, resolving a `label-content-name-mismatch` axe violation in the Storybook accessibility audit.
- **`aria-selected` on listbox options**: Added the required `aria-selected={false}` attribute to `<li role="option">` elements in the paginator to satisfy the ARIA `listbox` ownership rules.
- **Lint suppressions for positive `tabIndex` tests**: Test assertions that intentionally render `tabIndex > 0` are now wrapped with targeted `eslint-disable`/`eslint-enable` comments to keep lint clean without weakening the production rule.


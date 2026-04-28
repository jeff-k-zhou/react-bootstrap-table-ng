---
title: New Release (2026-04-25)
authors: jeff-k-zhou
---

## Changed Packages

All `react-bootstrap-table-ng` packages version bump to `5.19.5`

## Changelog

### Bug fixes

- Fixed a redirect issue in Storybook when interacting with custom pagination renderers by ensuring click events are properly prevented.

### Features

- Added **Pagination Jump Control** feature, allowing users to jump to a specific page by typing the page number.
  - Standardized component naming: `PaginationJump` and `PaginationJumpStandalone`.
  - Added `showPageJump` prop to `paginationFactory` for easy enablement.
  - Introduced `PaginationJumpStandalone` for fully custom pagination layouts using `PaginationProvider`.
- Added `rowIdPrefix` prop to `BootstrapTable` component for customizing row IDs to provide stable identifiers for integration with external libraries. It could be a string or a function that returns a string. The row ID will be `tableId-row-key` by default. The row ID will be `rowIdPrefix-row-key` if a string is provided. The row ID will be `function(row, index)-row-key` if a function is provided.

### Improvements

- Optimized pagination component logic for better performance and reliability.
- Updated documentation and added new Storybook stories for the pagination jump feature.

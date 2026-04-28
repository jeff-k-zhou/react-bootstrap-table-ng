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

### Improvements

- Optimized pagination component logic for better performance and reliability.
- Updated documentation and added new Storybook stories for the pagination jump feature.

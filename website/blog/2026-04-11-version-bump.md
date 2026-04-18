---
title: New Release (2026-04-11)
authors: jeff-k-zhou
---

## Changed Packages

All `react-bootstrap-table-ng` packages version bump to `5.19.3`

## Changelog

- Using react 18 features such hooks
- Added table id if not specified
- Converted storybook code with react features
- Set current page to 1 when do remote filter or search
- Fixed remote with default filter value didn't do filtering issue
- Added test case for remote filter with default value
- Cleanup unnecessary eslints
- Upgrade yarn and storybook to the latest
- Added interaction tests into stories
- Fixed table expose api issues, added console log checks for BasicTable
- Added checking console log for base table interaction test in storybook
- Added click on sorting interaction tests
- Added showing full text when hover ellipsis cell
- Added stories for cell expand
- Upgraded storybook to 10.3.3, fixed size-per-page-option redirect issue
- Added unit test for cell expandable flag
- Fixed lint errors and warnings

### Bug fixes

N/A

### Features

- Cell expand feature. Cell expand will be enabled by default. To disable expand for a column, set column.cellExpandable to false.

### Enhancements

N/A

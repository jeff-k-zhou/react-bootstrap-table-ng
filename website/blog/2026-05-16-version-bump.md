---
title: Accessibility Milestone Release (2026-05-16)
authors: jeff-k-zhou
---

## Changed Packages

All `react-bootstrap-table-ng` packages version bump to `5.19.6`

## Overview

This release marks a significant milestone in our commitment to inclusive design. We have implemented comprehensive accessibility improvements across all `react-bootstrap-table-ng` packages, ensuring full compliance with **WCAG 2.1 (Level AA)** standards.

## Changelog

### Accessibility Features

- **Automated A11y Guardrails**: Integrated `jest-axe` for unit testing and `axe-playwright` into our Storybook test runner. Every component and interactive state is now automatically scanned for accessibility violations during development and CI.
- **Enhanced Keyboard Navigation**:
  - Implemented focus management for **Row Expansion**. Users can now toggle row visibility using `Space` or `Enter`.
  - Added `:focus` support for **Cell Expansion**. Truncated content is now visible when tabbing through the table.
  - Standardized `tabIndex` management to ensure a logical and predictable focus flow.
- **Improved Screen Reader Support**:
  - Added descriptive `aria-label`s to all pagination controls (First, Prev, Next, Last).
  - Implemented `aria-expanded` and `aria-current` state communication for rows and pagination items.
  - Added visually hidden (`sr-only`) labels for selection and expansion columns to provide context without cluttering the UI.
- **Semantic HTML Refactor**:
  - Transitioned interactive elements from container `<td>`/`<th>` tags to nested focusable elements (`button`, `input`).
  - Fixed "empty table header" violations by ensuring every header cell has an accessible name.

### Bug Fixes

- Fixed a "double tab stop" issue in the row selection column.
- Resolved a regression in radio-button selection where already-selected items wouldn't trigger state updates on re-click.
- Fixed module resolution issues in the test suite that occurred when running tests without a full production build.

## How to Verify

We encourage all developers to update to the latest version and verify the improvements.

## Accessibility Assessment Report: `react-bootstrap-table-ng`

This report provides an assessment of the accessibility (a11y) implementations across all core and supplementary packages in the `react-bootstrap-table-ng` monorepo (excluding the `example` package). The evaluation is structured around the four **WCAG 2.1 Principles: Perceivable, Operable, Understandable, and Robust (POUR)**.

_Note: As a UI component library, maximum compliance is evaluated based on the semantic structure, keyboard event handling, and ARIA state management the library provides. Visual compliance (like color contrast, a Level AA/AAA requirement) depends partly on the user's provided CSS (e.g., Bootstrap)._

## WCAG 2.1 Compliance Matrix

| Package                              | Perceivable | Operable | Understandable | Robust | Overall Rating |
| :----------------------------------- | :---------: | :------: | :------------: | :----: | :------------: |
| `react-bootstrap-table-ng` (Core)    |   **AA**    |  **AA**  |     **AA**     | **AA** |     **AA**     |
| `react-bootstrap-table-ng-paginator` |   **AA**    |  **AA**  |     **AA**     | **AA** |     **AA**     |
| `react-bootstrap-table-ng-toolkit`   |   **AA**    |  **AA**  |     **AA**     | **AA** |     **AA**     |
| `react-bootstrap-table-ng-filter`    |   **AA**    |  **AA**  |     **AA**     | **AA** |     **AA**     |
| `react-bootstrap-table-ng-editor`    |   **AA**    |  **AA**  |     **AA**     | **AA** |     **AA**     |
| `react-bootstrap-table-ng-overlay`   |   **AA**    |  **AA**  |     **AA**     | **AA** |     **AA**     |

---

## Breakdown by Package

### 1. `react-bootstrap-table-ng` (Core)

- **Perceivable (AA):** Meets Level A (1.1.1 Non-text Content) by hiding visual sorting carets (`aria-hidden="true"`) and Level AA (1.3.1 Info and Relationships) by supporting `caption` elements and `aria-label` for screen reader context.
- **Operable (AA):** Meets Level A (2.1.1 Keyboard) by providing a fully navigable cell grid (`tabIndexCell`) and focusable resize handlers. Meets Level AA (2.4.7 Focus Visible) by ensuring standard interactive elements retain focus outlines (assuming default CSS).
- **Understandable (AA):** Meets Level A (3.2.2 On Input) and AA criteria. It utilizes `aria-sort` and dynamic `aria-expanded` attributes to explicitly tell users the active state of data interactions.
- **Robust (AA):** Meets Level A (4.1.2 Name, Role, Value). Automated `jest-axe` tests validate robustness against semantic regressions. The use of `aria-live="polite"` and `aria-atomic="true"` on row expansions/sections ensures it meets Level AA (4.1.3 Status Messages).

### 2. `react-bootstrap-table-ng-paginator`

- **Perceivable (AA):** Satisfies Level AA (1.3.1) by wrapping pagination inside `<nav aria-label="...">`.
- **Operable (AA):** Meets Level A (2.1.1 Keyboard) and Level AA limits. Dropdowns and jump-to-page fields correctly enforce `tabIndex={0}` or `-1` dynamically.
- **Understandable (AA):** Achieves Level AA by explicitly using `aria-current="page"` (a strict WCAG requirement to indicate the current item within a set) alongside clear `aria-disabled` tracking.
- **Robust (AA):** Uses semantic `role="listbox"` and `role="option"`. Meets Level AA (4.1.3 Status Messages) by utilizing polite live regions for the "Showing rows X to Y of Z" textual updates.

### 3. `react-bootstrap-table-ng-toolkit`

- **Perceivable (AA):** Satisfies Level A and AA. Features like the global SearchBar use `aria-labelledby`, and purely visual elements (like modal close icons) use `aria-hidden="true"`.
- **Operable (AA):** Meets Level AA. Delete/Insert modals correctly restrict focus layers using `tabIndex={-1}` and nested `role="document"` structures, avoiding keyboard traps (2.1.2 No Keyboard Trap - Level A).
- **Understandable (AA):** Column visibility toggles utilize `aria-pressed="true/false"`, which cleanly conveys the operation's state context to assistive technologies.
- **Robust (AA):** Meets Level AA (4.1.3 Status Messages) by utilizing visually hidden `aria-live="polite"` regions that announce search updates ("Search applied for: X") and column visibility changes ("Column X toggled").

### 4. `react-bootstrap-table-ng-filter`

- **Perceivable (AA):** Form inputs satisfy Level A (1.1.1) and Level AA (1.3.5 Identify Input Purpose). Each filter uniquely identifies itself (`"Comparison operator for Date filter"`).
- **Operable (AA):** Relies on native interactive elements (`select`, `input type="text/number/date"`) guaranteeing native keyboard operability (Level A/AA).
- **Understandable (AA):** Achieves Level A (3.3.2 Labels or Instructions) natively. Multi-selects define `aria-multiselectable="true"`, allowing users to understand how to interact with the input without trial and error.
- **Robust (AA):** Meets Level AA (4.1.3 Status Messages) by incorporating `aria-live="polite"` status announcements whenever a filter is applied or cleared, ensuring background updates are communicated to assistive technology.

### 5. `react-bootstrap-table-ng-editor`

- **Perceivable (AA):** Errors and input associations satisfy Level AA semantics.
- **Operable (AA):** Cell editing automatically shifts focus directly to the input context and traps keyboard input within the cell until explicitly dismissed or saved (2.1.1 Keyboard).
- **Understandable (AA):** Strictly follows Level A (3.3.1 Error Identification). The editor displays error indicators (`role="alert"`) and programmatically links the invalid input to the error description utilizing `aria-invalid="true"` and `aria-describedby="[error-id]"`.
- **Robust (AA):** Meets Level AA (4.1.3 Status Messages). The editor indicator utilizes `role="alert"` enhanced with explicit `aria-live="assertive"` and `aria-atomic="true"` properties to ensure consistent and immediate error announcements.

### 6. `react-bootstrap-table-ng-overlay`

- **Perceivable (AA):** Satisfies Level AA. Loading spinners are given `role="img"` and `aria-labelledby` so screen readers don't skip over the visual feedback.
- **Operable (AA):** Clickable overlays fall back to keyboard users by programmatically assigning `role="button"` and `tabIndex={0}`.
- **Understandable (AA):** Achieves Level AA (3.2.4 Consistent Identification) and Level A (3.3.2 Labels or Instructions). The overlay utilizes the `text` prop for dynamic status announcements and provides an `ariaLabel` (or context-aware default) for interactive overlays, ensuring they are consistently identified and labeled.
- **Robust (AA):** Directly achieves Level AA (4.1.3 Status Messages) by utilizing `aria-busy={active}` on the wrapping container while injecting a `role="status"` live region that communicates background data fetching passively without hijacking keyboard focus.

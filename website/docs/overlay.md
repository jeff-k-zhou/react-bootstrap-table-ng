---
id: overlay
title: Remote Loading/Overlay
sidebar_label: Overlay
---

In `react-bootstrap-table-ng`, you will be easier to custom the loading or overlay on table no matter if remote enabled or not. In the following, we have two way to do it:

-----

## Empty Table
[**`noDataIndication`**](./table-props#nodataindication-function) is a simple case you can take it, if current data size is empty, `react-bootstrap-table-ng` will call the `noDataIndication` prop and get the result to display on the table.   

[**Here**](pathname:///react-bootstrap-table-ng/storybook/index.html?selectedKind=EmptyTableOverlay) is a quick exmaple for `noDataIndication`.

## Loading Table
In the most of case for remote mode, you need the loading animation to tell the user the table is loading or doing some action in the background. Hence, you can lervarge [**`overlay`**](./table-props#overlay-function) prop.

[**Here**](pathname:///react-bootstrap-table-ng/storybook/index.html?selectedKind=EmptyTableOverlay) is also a example for `overlay`

## Accessibility

The `react-bootstrap-table-ng-overlay` package is compliant with **WCAG 2.1 Level AA** for status messages and identification.

- **Status Announcements**: When the overlay is active, it automatically notifies screen readers via a polite live region. If the `text` prop is provided as a string, it will be announced (e.g., "Fetching products...").
- **Interactive Overlays**: If an `onClick` handler is provided, you should also provide an `ariaLabel` prop to ensure the overlay button has a clear name for assistive technology.

```js
overlay={ overlayFactory({
  active: true,
  text: 'Loading...',
  ariaLabel: 'Click to cancel loading',
  onClick: handleCancel
}) }
```

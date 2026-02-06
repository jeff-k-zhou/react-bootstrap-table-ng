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

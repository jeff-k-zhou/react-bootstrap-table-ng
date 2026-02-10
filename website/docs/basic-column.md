---
id: basic-column
title: Work on Column
sidebar_label: Work on Column
---

Firstly, legacy `react-bootstrap-table` is hard to customize the DOM Event, Attributes on column or header column. In the `react-bootstrap-table-ng`, we make those bad design become more easy and flexible.

**[Live Demo For Column](pathname:///react-bootstrap-table-ng/storybook/index.html?selectedKind=Work%20on%20Columns)**   
**[Live Demo For Header Column](pathname:///react-bootstrap-table-ng/storybook/index.html?selectedKind=Work%20on%20Header%20Columns)**   
**[API & Props Definition](./column-props)**

-----

## Formatting Table Column

[`column.formatter`](./column-props#columnformatter-function) is a good chance for you to customize the cell. If you just want to add some styling, attributes or DOM event linstener, `react-bootstrap-table-ng` have respective props to handle:

* [`column.style`](./column-props#columnstyle-object-function)
* [`column.classes`](./column-props#columnclasses-string-function)
* [`column.events`](./column-props#columnevents-object)
* [`column.attrs`](./column-props#columnattrs-object-function)

In addition, we also give some useful props to let you have a quickly configuration:

* [`column.hidden`](./column-props#columnhidden-bool)
* [`column.title`](./column-props#columntitle-bool-function)
* [`column.align`](./column-props#columnalign-string-function)
* *Welcome to submit a PR or issue for asking a convinence props for column :)*

## Formatting Table Header
Formatting header column is almost same as column formatting, we got [`column.headerFormatter`](./column-props#columnheaderformatter-function) to let you customize the content of a header column. Default `react-bootstrap-table-ng` will take [`column.text`](./column-props#columntext-required-string) as the content of header column.

Following, we list some useful props for customization:

* [`column.headerStyle`](./column-props#columnheaderstyle-object-function)
* [`column.headerClasses`](./column-props#columnheaderclasses-string-function)
* [`column.headerEvents`](./column-props#columnheaderevents-object)
* [`column.headerAttrs`](./column-props#columnheaderattrs-object-function)
* [`column.headerTitle`](./column-props#columnheadertitle-bool-function)
* [`column.headerAlign`](./column-props#columnheaderalign-string-function)
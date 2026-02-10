# react-bootstrap-table-ng-overlay

In `react-bootstrap-table-ng`, you will be easier to custom the loading or lverlay on table no matter if remote enabled or not. In the following, we have two way to do it:

**[Live Demo For Table Overlay](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/storybook/?path=/docs/table-overlay--docs)**

---

## Empty Table

[**`noDataIndication`**](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/storybook/?path=/story/table-overlay--empty-table-overlay) is a simple case you can take it, if current data size is empty, `react-bootstrap-table-ng` will call the `noDataIndication` prop and get the result to display on the table.

[**Here**](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/storybook/?path=/story/table-overlay--table-overlay) is a quick exmaple for `noDataIndication`.

## Loading Table

In the most of case for remote mode, you need the loading animation to tell the user the table is loading or doing some action in the background. Hence, you can lervarge [**`overlay`**](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/docs/table-props.html#overlay-function) prop.

[**Here**](https://jeff-k-zhou.github.io/react-bootstrap-table-ng/storybook/?path=/story/remote--remote-all-custom) is also a example for `overlay`

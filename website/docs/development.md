## Development Guide

### Setup
```bash
$ git clone https://github.com/jeff-k-zhou/react-bootstrap-table-ng.git
$ cd react-bootstrap-table-ng
$ npm install
```
### Development
```bash
$ npm run storybook
```

### Launch StoryBook
We use [storybook](https://storybook.js.org/) to list our examples and it also has hot reload from source code. Sometimes, it is also a good entry point to development.

```bash
$ cd packages/react-bootstrap-table-ng-example
$ npm run storybook
```

### Testing
```bash
$ npm test
$ npm run test:watch  # for watch mode
$ npm run test:coverage  # generate coverage report
```

### Accessibility Testing
We maintain WCAG 2.1 compliance using automated testing tools.

#### Unit Level (jest-axe)
```bash
$ yarn jest accessibility.test.tsx
```

#### Integration Level (axe-playwright)
To run accessibility audits against all Storybook stories:
```bash
$ yarn storybook:test
```


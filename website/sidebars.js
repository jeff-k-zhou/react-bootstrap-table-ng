// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    docs: [
        {
            type: 'category',
            label: 'Getting Started',
            items: [
                'about',
                'getting-started',
                'bootstrap4',
                'bootstrap5',
                'migration'
            ]
        },
        {
            type: 'category',
            label: 'Basic Usage',
            items: [
                'basic-row',
                'basic-column',
                'basic-sort',
                'basic-row-select',
                'basic-filter',
                'basic-cell-edit',
                'basic-pagination',
                'basic-row-expand'
            ]
        },
        {
            type: 'category',
            label: 'Remote Table',
            items: [
                'basic-remote',
                'overlay'
            ]
        },
        {
            type: 'category',
            label: 'Table Toolkits',
            items: [
                'toolkits-getting-started',
                'basic-search',
                'basic-export-csv',
                'basic-column-toggle'
            ]
        },
        {
            type: 'category',
            label: 'Exposed API',
            items: [
                'exposed-api'
            ]
        }
    ],
    api: [
        {
            type: 'category',
            label: 'Table Definition',
            items: [
                'table-props'
            ]
        },
        {
            type: 'category',
            label: 'Column Definition',
            items: [
                'column-props'
            ]
        },
        {
            type: 'category',
            label: 'Cell Editing Definition',
            items: [
                'cell-edit-props'
            ]
        },
        {
            type: 'category',
            label: 'Pagination Definition',
            items: [
                'pagination-props'
            ]
        },
        {
            type: 'category',
            label: 'Row Select Definition',
            items: [
                'row-select-props'
            ]
        },
        {
            type: 'category',
            label: 'Row Expand Definition',
            items: [
                'row-expand-props'
            ]
        },
        {
            type: 'category',
            label: 'Column Filter Definition',
            items: [
                'filter-props'
            ]
        },
        {
            type: 'category',
            label: 'Search Definition',
            items: [
                'search-props'
            ]
        },
        {
            type: 'category',
            label: 'Export to CSV Definition',
            items: [
                'export-csv-props'
            ]
        }
    ]
};

export default sidebars;

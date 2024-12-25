import react from "eslint-plugin-react";
import globals from "globals";
import babelParser from "@babel/eslint-parser";

import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from 'eslint-plugin-import';

export default [
    jsxA11y.flatConfigs.recommended,
    importPlugin.flatConfigs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.jsx"],
        ignores: [
            "**/node_modules",
            "**/package-lock.json",
            "**/coverage",
            "**/.eslintcache",
            "**/.DS_Store",
            "**/.vscode",
            "**/lerna-debug.log",
            "**/npm-debug.log*",
            "**/yarn-debug.log*",
            "**/yarn-error.log*",
            "**/storybook-static",
            "**/dist",
            "**/lib",
            "**/*.d.ts",
            "**/*.js.map",
            "packages/**/src/**/*.js",
        ],
    }, 
    {
        plugins: {
            react,
        },

        linterOptions: {
            reportUnusedDisableDirectives: "off"
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node,
                jest: false,
            },

            parser: babelParser,
            parserOptions: {
                ecmaFeatures: {
                jsx: true,
                },
            },
        },

        rules: {
            semi: "off",
            "arrow-parens": "off",
            "default-param-last": "off",
            "prefer-object-spread": "off",
            "class-methods-use-this": "off",
            "function-paren-newline": 0,
            "function-call-argument-newline": "off",
            "operator-linebreak": "off",
            "implicit-arrow-linebreak": "off",
            'import/no-dynamic-require': 'warn',
            'import/no-nodejs-modules': 'off',
            "no-else-return": "off",
            "object-curly-newline": "off",
            "no-multiple-empty-lines": "off",
            "no-trailing-spaces": "off",
            "no-restricted-globals": "off",
            'no-unused-vars': 'off',
            "lines-between-class-members": "off",
            "no-undef": "off",
            "prefer-destructuring": "off",
            "react/destructuring-assignment": 0,
            "react/sort-comp": 0,
            "react/no-this-in-sfc": 0,
            "react/default-props-match-prop-types": 0,
            "react/no-unused-prop-types": 0,
            "react/no-access-state-in-setstate": 0,
            "react/button-has-type": 0,
            "react/function-component-definition": 0,
            "react/no-unstable-nested-components": 0,
            "react/no-unused-class-component-methods": 0,
            "react/static-property-placement": 0,
            "react/state-in-constructor": 0,
            "react/jsx-wrap-multilines": 0,
            "react/jsx-closing-tag-location": 0,
            "react/jsx-no-bind": 0,
            "react/jsx-one-expression-per-line": 0,
            "react/jsx-curly-brace-presence": 0,
            "react/jsx-props-no-spreading": 0,
            "react/jsx-no-constructed-context-values": 0,
            "react/jsx-fragments": 0,
            "jsx-a11y/anchor-is-valid": 0,
            "jsx-a11y/click-events-have-key-events": 0,
            "jsx-a11y/label-has-associated-control": 0,
            "jsx-a11y/control-has-associated-label": 0,
            "react/forbid-prop-types": 0,
            "react/jsx-filename-extension": 0,
            "react/jsx-space-before-closing": 0,

            "react/jsx-tag-spacing": ["error", {
                beforeSelfClosing: "always",
            }],

            "import/no-relative-packages": 0,
            "import/extensions": 0,

            "import/no-unresolved": [0, {
                ignore: ["^react-bootstrap-table"],
            }],

            "import/prefer-default-export": 0,
            "import/no-extraneous-dependencies": 0,
            quotes: "off",
            indent: "off",

            "max-len": ["warn", {
                code: 600,
            }],

            "no-unused-vars": "off",
            "no-param-reassign": "off",
            "no-nested-ternary": "off",
            "no-return-assign": "off",
            "comma-dangle": "off",
            "space-before-function-paren": "off",
            "no-confusing-arrow": "off",
            "react/jsx-curly-newline": 0,
            "react/jsx-curly-spacing": 0,
            "react/prefer-stateless-function": 0,
            "react/require-default-props": 0,
            "react/no-array-index-key": 0,
        },
    }
];
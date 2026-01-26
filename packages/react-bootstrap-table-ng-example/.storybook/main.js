const path = require("path");

module.exports = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/preset-create-react-app",
        "@storybook/addon-onboarding",
        "@storybook/addon-docs"
    ],

    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },

    staticDirs: ["../public"],

    previewHead: (head) => `
    ${head}
    <script src="https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js"></script>
    <!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css" integrity="sha384-Smlep5jCw/wG7hdkwQ/Z5nLIefveQRIY9nfy6xoR1uRYBtpZgI6339F5dgvm/e9B" crossorigin="anonymous"> -->
  `,

    webpackFinal: async (config) => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            include: [
                path.resolve(__dirname, "../../react-bootstrap-table-ng"),
                path.resolve(__dirname, "../../react-bootstrap-table-ng-filter"),
                path.resolve(__dirname, "../../react-bootstrap-table-ng-paginator"),
                path.resolve(__dirname, "../../react-bootstrap-table-ng-toolkit"),
                path.resolve(__dirname, "../../react-bootstrap-table-ng-editor"),
                path.resolve(__dirname, "../../react-bootstrap-table-ng-overlay"),
            ],
            use: [
                {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "babel-preset-react-app",
                                {
                                    runtime: "automatic",
                                },
                            ],
                        ],
                    },
                },
            ],
        });
        if (config.resolve) {
            config.resolve.alias = {
                ...(config.resolve.alias || {}),
                "file-saver": path.resolve(
                    __dirname,
                    "../node_modules/file-saver"
                ),
            };
            config.resolve.modules = [
                path.resolve(__dirname, "../node_modules"),
                path.resolve(__dirname, "../../../node_modules"),
                "node_modules",
                ...(config.resolve.modules || []),
            ];
        }
        return config;
    }
};

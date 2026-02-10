// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from "@storybook/react-webpack5";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import * as sass from "sass";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

    addons: [
        getAbsolutePath("@storybook/addon-links"),
        //getAbsolutePath("@storybook/addon-onboarding"),
        getAbsolutePath("@storybook/addon-docs"),
    ],

    framework: {
        name: getAbsolutePath("@storybook/react-webpack5"),
        options: {},
    },

    staticDirs: ["../public"],
    managerHead: (head) => `
    ${process.env.NODE_ENV === "production"
            ? `<base href="/react-bootstrap-table-ng/storybook/">`
            : ""
        }
    ${head}
  `,

    previewHead: (head) => `
    ${process.env.NODE_ENV === "production"
            ? `<base href="/react-bootstrap-table-ng/storybook/">`
            : ""
        }
    ${head}
    <script src="https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js"></script>
    <!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.2/css/bootstrap.min.css" integrity="sha384-Smlep5jCw/wG7hdkwQ/Z5nLIefveQRIY9nfy6xoR1uRYBtpZgI6339F5dgvm/e9B" crossorigin="anonymous"> -->
  `,

    webpackFinal: async (config) => {
        // Find existing rules for CSS to avoid duplication
        if (config.module?.rules) {
            config.module.rules = config.module.rules.map((rule) => {
                if (
                    rule &&
                    typeof rule === "object" &&
                    "test" in rule &&
                    rule.test instanceof RegExp &&
                    rule.test.toString().includes("css")
                ) {
                    return { ...rule, exclude: /\.s[ac]ss$/i };
                }
                return rule;
            });

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

            config.module.rules.push({
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: sass,
                        },
                    },
                ],
            });

            config.module.rules.push({
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: "asset/resource",
            });
        }

        if (config.resolve) {
            config.resolve.alias = {
                ...(config.resolve.alias || {}),
                "file-saver": path.resolve(
                    __dirname,
                    "../../../node_modules/file-saver"
                ),
            };
            config.resolve.modules = [
                path.resolve(__dirname, "../../../node_modules"),
                "node_modules",
                ...(config.resolve.modules || []),
            ];
        }
        if (config.output && process.env.NODE_ENV === "production") {
            config.output.publicPath = "../storybook/";
        }
        return config;
    },
};

export default config;

function getAbsolutePath(value: string): any {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

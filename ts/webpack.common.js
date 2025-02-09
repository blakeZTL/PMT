import ESLintPlugin from "eslint-webpack-plugin";

import { resolve as _resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
export const devtool = "source-map";
export const entry = {
    form: "./src/code/forms/index.ts",
    ribbon: "./src/code/ribbon/index.ts",
};
const __dirname = dirname(fileURLToPath(import.meta.url));

export const output = {
    filename: "[name].js",
    sourceMapFilename: "maps/[name].js.map",
    path: _resolve(__dirname, "../Webresources/js"),
    library: ["bebe", "[name]"],
    libraryTarget: "var",
};
export const module = {
    rules: [
        {
            test: /\.(ts|tsx)$/,
            use: "ts-loader",
            exclude: /node_modules/,
        },
    ],
};
export const plugins = [
    new CleanWebpackPlugin(),
    new ESLintPlugin({
        fix: true,
        extensions: ["ts", "tsx"],
        lintDirtyModulesOnly: true,
        failOnError: true,
    }),
];
export const resolve = {
    extensions: [".ts", ".js"],
};

export default {
    devtool,
    entry,
    output,
    module,
    plugins,
    resolve,
};

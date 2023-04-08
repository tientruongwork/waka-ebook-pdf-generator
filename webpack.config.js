const path = require("path");

const nodeExternals = require("webpack-node-externals");
const CleanTerminalWebpackPlugin = require("clean-terminal-webpack-plugin");
const { NodemonWebpackPlugin } = require("./webpack-plugins/NodemonWebpackPlugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/app.ts",
    },
    mode: process.env.NODE_ENV || "development",
    target: "node",
    devtool: "inline-source-map",
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "build"),
    },
    plugins: [
        new NodemonWebpackPlugin(),
        new CleanTerminalWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "src/templates",
                    to: "templates",
                },
                {
                    from: "src/books",
                    to: "books",
                },
            ],
        }),
    ],
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const config = {
    entry: "./public/index.js",
    module: {
        rules: [
            {
                test: /\.(ts|js)?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-typescript"],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js",
    }
};
module.exports = {
    mode: 'development',
    entry: {
        index: './public/index.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 3000,
    },
};
exports.default = config;
//# sourceMappingURL=webpack.config.js.map
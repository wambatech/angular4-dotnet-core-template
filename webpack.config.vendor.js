const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require("webpack-merge");
//const rollup = require("rollup-loader");

module.exports = (env) => {
    const extractCSS = new ExtractTextPlugin("vendor.css");
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: {
            modules: true
        },
        resolve: {
            extensions: [".js"]
        },
        module: {
            rules: [
                {
                    test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/,
                    use: "url-loader?limit=100000"
                },
                {
                    test: /\.js$/,
                    loader: 'rollup-loader'
                }
            ]
        },
        entry: {
            vendor: [
                "@angular/common",
                "@angular/core",
                "@angular/forms",
                "@angular/http",
                "@angular/platform-browser",
                "@angular/platform-browser-dynamic",
                "@angular/router",
                "bootstrap/dist/css/bootstrap.css",
                "reflect-metadata",
                "zone.js"
            ]
        },
        output: {
            publicPath: "/dist/",
            filename: "[name].js",
            library: "[name]_[hash]"
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
            new webpack.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/, path.join(__dirname, "./ClientApp")), // Workaround for https://github.com/angular/angular/issues/11580
            new webpack.IgnorePlugin(/^vertx$/) // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
        ]
    };

    const bundleConfig =
        merge(
            sharedConfig,
            {
                output: {
                    path: path.join(__dirname, "wwwroot", "dist")
                },
                module: {
                    rules: [
                        {
                            test: /\.css(\?|$)/,
                            use: extractCSS.extract({ use: "css-loader" })
                        }
                    ]
                },
                plugins: [
                    extractCSS,
                    new webpack.ContextReplacementPlugin(
                        /angular(\\|\/)core(\\|\/)@angular/,
                        path.resolve(__dirname, '../src')
                    ),
                    new webpack.DllPlugin({
                        path: path.join(__dirname, "wwwroot", "dist", "[name]-manifest.json"),
                        name: "[name]_[hash]"
                    })
                ].concat(
                    isDevBuild ?
                        [] :
                        [
                            new webpack.optimize.UglifyJsPlugin()
                        ])
            });

    return [bundleConfig];
}

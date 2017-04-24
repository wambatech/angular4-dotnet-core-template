const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;

module.exports = (env) => {
    const bundleOutputDir = "./wwwroot/dist";
    const isDevBuild = !(env && env.prod);

    const sharedConfig = {
        context: __dirname,
        stats: {
            modules: true
        },
        resolve: {
            extensions: [".js", ".ts"]
        },
        output: {
            filename: "[name].js",
            publicPath: "/dist/"
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /ClientApp/,
                    use: ["awesome-typescript-loader?silent=true", "angular2-template-loader"]
                },
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    use: "html-loader?minimize=false"
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: ["to-string-loader", "css-loader"]
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    exclude: /node_modules/,
                    use: "url-loader?limit=25000"
                },
                {
                    test: /\.less$/,
                    exclude: /node_modules/,
                    loader: 'raw-loader!less-loader'
                }
            ]
        },
        plugins: [
            new CheckerPlugin()
        ]
    };

    const bundleConfig =
        merge(
            sharedConfig,
            {
                entry: {
                    "main-client": "./ClientApp/main.ts"
                },
                output: { path: path.join(__dirname, bundleOutputDir) },
                plugins: [
                    new webpack.DllReferencePlugin({
                        context: __dirname,
                        manifest: require("./wwwroot/dist/vendor-manifest.json")
                    })
                ].concat(
                    isDevBuild ?
                        [
                            // Plugins that apply in development builds only
                            new webpack.SourceMapDevToolPlugin({
                                filename: "[file].map", // Remove this line if you prefer inline source maps
                                moduleFilenameTemplate: path.relative(bundleOutputDir, "[resourcePath]") // Point sourcemap entries to the original file locations on disk
                            })
                        ] :
                        [
                            // Plugins that apply in production builds only
                            new webpack.optimize.UglifyJsPlugin()
                        ])
            });

    return [bundleConfig];
};

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const SRC = path.resolve( __dirname, 'src' );
const DIST = path.resolve(__dirname, 'dist');

module.exports = {
    context: SRC,
    entry: 'index.ts',
    module: {
        rules: [
                // PRE-LOADERS
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    use: 'source-map-loader'
                },
                // LOADERS
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,           // images
                    use: [ 'file-loader' ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,    // fonts
                    use: [ 'file-loader' ]
                },
                {
                    test:/\.sass$/,
                    use: [{
                        loader: 'style-loader'  // creates style nodes from JS strings
                    }, {
                        loader: 'css-loader',   // translates CSS into CommonJS
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: 'sass-loader',  // compiles Sass to CSS
                        options: {
                            sourceMap: true
                        }
                    }]
                }
            ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        modules: [
            SRC,
            'node_modules'
]
    },
    output: {
        path: DIST
    },
    plugins: [
        new CleanWebpackPlugin([DIST]),
    ]
};

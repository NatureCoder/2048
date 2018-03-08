const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader']
                    })
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
        new ExtractTextPlugin('styles.css')
    ]
};

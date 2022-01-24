const path = require('path');

const ROOT = path.resolve( __dirname, '.' );
const SRC  = path.resolve( __dirname, 'src' );
const TEST = path.resolve( __dirname, 'test' );
const DIST = path.resolve( __dirname, 'dist');

module.exports = {
    context: ROOT,
    entry: './src/code/index.ts',
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
                    use: [ 'style-loader', 'css-loader', 'sass-loader' ]
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
        path: DIST,
        clean: true,
        devtoolModuleFilenameTemplate: function(info) {
            return '../'+info.resourcePath;
            // return "file:///"+info.absoluteResourcePath;
        }
    }
};

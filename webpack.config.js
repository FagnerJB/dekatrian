const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
   mode: 'production',
   entry: './src/js/index.js',
   optimization: {
      mangleExports: false,
      minimizer: [
         new TerserPlugin({
            terserOptions: {
               mangle: false,
            },
         }),
      ],
   },
   output: {
      filename: './assets/script.min.js',
      path: path.resolve(__dirname, 'src'),
   },
}

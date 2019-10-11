// vue.config.js
module.exports = {
    externals: {
        'axios': 'Axios',
    },
    pages: {
        index: {
            // entry for the page
            entry: './src/main.js',
            // the source template
            template: './public/index.html',
            // the output filename
            filename: 'index.html'
        }
    },
    publicPath: process.env.NODE_ENV === 'production' ? 'http://thecapsule.email/dist' : '/',
    assetsDir: './src/assets',
    outputDir: './dist'
};

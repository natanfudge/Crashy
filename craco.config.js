const path = require('path')

const updateWebpackConfig = {
    overrideWebpackConfig: ({ webpackConfig }) => {

        // This is a bit brittle, but this retrieves the `babel-loader` for me.
        const loader = webpackConfig.module.rules[1].oneOf[2]
        loader.include = [
            path.join(__dirname, 'src'),
            path.join(__dirname, 'crash-parser/src'), // This is the directory containing the symlinked-to files
        ]

        return webpackConfig;
    }
}
module.exports = {
    plugins: [
        { plugin: updateWebpackConfig, options: {} }
    ]
}

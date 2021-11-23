// const path = require('path')

// const updateWebpackConfig = {
//     overrideWebpackConfig: ({ webpackConfig }) => {
//
//         // This is a bit brittle, but this retrieves the `babel-loader` for me.
//         const loader = webpackConfig.module.rules[1].oneOf[2]
//         loader.include = [
//             path.join(__dirname, 'src'),
//             path.join(__dirname, 'crash-parser/src'), // This is the directory containing the symlinked-to files
//         ]
//
//         return webpackConfig;
//     }
// }
const CracoEsbuildPlugin = require('craco-esbuild');

module.exports = {
    plugins: [
        // { plugin: updateWebpackConfig, options: {} },
        {
            plugin: CracoEsbuildPlugin, options: {
                //TODO: use js to get absolute path
                includePaths: ['C:\\Users\\natan\\Desktop\\crashy\\crash-parser\\src']
            }
        }
    ]
}

// const path = require('path');
// const { whenProd } = require('@craco/craco');
//
// /* Allows importing code from other packages in a monorepo. Explanation:
// When you use lerna / yarn workspaces to import a package, you create a symlink in node_modules to
// that package's location. By default Webpack resolves those symlinks to the package's actual path,
// which makes some create-react-app plugins and compilers fail (in prod builds) because you're only
// allowed to import things from ./src or from node_modules
//  */
// const disableSymlinkResolution = {
//     plugin: {
//         overrideWebpackConfig: ({ webpackConfig }) => {
//             webpackConfig.resolve.symlinks = false;
//             return webpackConfig;
//         },
//     },
// };
//
// const webpackSingleModulesResolution = {
//     alias: {
//         react$: path.resolve(__dirname, 'node_modules/react'),
//         'react-dom$': path.resolve(__dirname, 'node_modules/react-dom'),
//         'react-router-dom$': path.resolve(__dirname, 'node_modules/react-router-dom'),
//     },
// };
//
// const jestSingleModuleResolution = {
//     moduleNameMapper: {
//         '^react$': '<rootDir>/node_modules/react',
//         '^react-dom$': '<rootDir>/node_modules/react-dom',
//         '^react-router-dom$': '<rootDir>/node_modules/react-router-dom',
//     },
// };
//
// module.exports = {
//     plugins: [...whenProd(() => [disableSymlinkResolution], [])],
//     webpack: webpackSingleModulesResolution,
//     jest: {
//         configure: {
//             jestSingleModuleResolution,
//         },
//     },
// };

// module.exports = {
//     webpack: {
//         configure: (webpackConfig) => ({
//             ...webpackConfig,
//             resolve: {
//                 ...webpackConfig.resolve,
//                 symlinks: false
//             }
//         })
//     }
// }

// webpack: 48 secs
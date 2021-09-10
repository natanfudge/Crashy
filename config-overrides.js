/* config-overrides.js */
/* eslint-disable react-hooks/rules-of-hooks */
const { useBabelRc, override, fixBabelImports} = require('customize-cra');

// module.exports = override(useBabelRc());
fixBabelImports("@mui/material")
fixBabelImports("@mui/icons-material")
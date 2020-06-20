const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    "catholic-dioceses": "./viz/catholic-dioceses/main.js",
  },
  output: {
    path: path.resolve(__dirname, 'assets/viz/'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
};

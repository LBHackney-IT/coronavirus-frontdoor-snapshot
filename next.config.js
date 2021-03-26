module.exports = {
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/.*\.test\.js$/));
    return config;
  },
  env: {
    ADDRESSES_API_URL: process.env.ADDRESSES_API_URL,
    ADDRESSES_API_KEY: process.env.ADDRESSES_API_KEY,
    HOTJAR_ID: process.env.HOTJAR_ID,
    OPTIMIZE_ID: process.env.OPTIMIZE_ID,
    EXTERNAL_USER_GROUP: process.env.EXTERNAL_USER_GROUP,
    INH_URL: process.env.INH_URL
  },
  distDir: 'build/_next',
  target: 'server'
};

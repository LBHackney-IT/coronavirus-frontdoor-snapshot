module.exports = {
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/.*\.test\.js$/));
    return config;
  },
  env: {
    ADDRESSES_API_URL: process.env.ADDRESSES_API_URL,
    ADDRESSES_API_KEY: process.env.ADDRESSES_API_KEY,
    HOTJAR_ID: process.env.HOTJAR_ID,
    INH_URL: process.env.INH_URL
  },
  distDir: 'build/_next',
  target: 'server'
};

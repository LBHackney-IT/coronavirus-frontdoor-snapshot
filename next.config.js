module.exports = {
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/.*\.test\.js$/));
    return config;
  },
  env: {
    ADDRESSES_API_URL: process.env.ADDRESSES_API_URL,
    ADDRESSES_API_KEY: process.env.ADDRESSES_API_KEY,
    OPTIMIZE_ID: process.env.OPTIMIZE_ID,
    EXTERNAL_USER_GROUP: process.env.EXTERNAL_USER_GROUP,
    INH_URL: process.env.INH_URL,
    SYNONYMS: process.env.SYNONYMS
  },
  distDir: 'build/_next',
  target: 'server',
  headers: async () => {
    return [
      {
        source: '/(.*?)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'deny'
          },
          {
            key: 'X-XSS-Protection',
            value: '1'
          }
        ]
      }
    ];
  }
};

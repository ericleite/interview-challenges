const nextConfig = {
  serverRuntimeConfig: {
    ROOT_DIR: __dirname,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[path][name].[hash][ext]",
      },
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      constants: `${__dirname}/constants`,
      types: `${__dirname}/types`,
      utils: `${__dirname}/utils`,
    };

    config.resolve.fallback = {
      fs: false,
      path: false,
      "stream/promises": false,
    };

    return config;
  },
};

module.exports = nextConfig;

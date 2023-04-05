module.exports = {
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

    return config;
  },
};

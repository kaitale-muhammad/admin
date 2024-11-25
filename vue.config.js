
module.exports = {
  transpileDependencies: true,

  devServer: {
    proxy: {
      '/api': {
        target: 'https://admin2-pt6zosxz.b4a.run', // Backend server URL
        changeOrigin: true, // Enable CORS proxying
        pathRewrite: { '^/api': '' }, // Rewrite '/api' to ''
        secure: true, // If your backend uses HTTPS
      },
    },
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
};

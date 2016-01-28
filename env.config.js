module.exports = {
  dev: {
    apiServer: {
      port: 3003,
      host: 'localhost'
    },
    renderServer: {
      port: 3004,
      host: 'localhost'
    },
    webpackServer: {
      port: 3005,
      host: 'localhost'
    }
  },
  prod: {
    apiServer: {
      port: 3000,
      host: 'localhost'
    },
    renderServer: {
      port: 3001,
      host: 'localhost'
    }
  }
};

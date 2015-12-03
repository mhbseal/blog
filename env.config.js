module.exports = {
  dev: {
    apiServer: {
      port: 3003,
      host: 'localhost',
      domain: ''
    },
    renderServer: {
      port: 3004,
      host: 'localhost',
      domain: ''
    },
    webpackServer: {
      port: 3005,
      host: 'localhost',
      domain: ''
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





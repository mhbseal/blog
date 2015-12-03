module.exports = {
  dev: {
    apiServer: {
      port: 3003,
      host: '192.168.56.101',
      //host: 'localhost',
      domain: ''
    },
    renderServer: {
      port: 3004,
      //host: 'localhost',
      host: '192.168.56.101',
      domain: ''
    },
    webpackServer: {
      port: 3005,
      host: '192.168.56.101',
      //host: 'localhost',
      domain: ''
    }
  },
  prod: {
    apiServer: {
      port: 3000,
      //host: 'localhost'
      host: '192.168.56.101',
    },
    renderServer: {
      port: 3001,
      //host: 'localhost'
      host: '192.168.56.101',
    }
  }
};





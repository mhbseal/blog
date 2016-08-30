module.exports = function (__DEVELOPMENT__, __CLIENT__) {
  var
    config = {
      "presets": ["react", "es2015", "stage-0"],
      "plugins": [
        "transform-runtime",
        "add-module-exports",
        "transform-decorators-legacy"
      ]
    };

  if (__DEVELOPMENT__) {
    config.plugins.push(["react-transform", {
      transforms: [{
        "transform": "react-transform-catch-errors",
        "imports": ["react", "redbox-react"]
      }]
    }])
  }

  if (__DEVELOPMENT__ && __CLIENT__) {
    config.plugins[3][1].transforms.push({
      "transform": "react-transform-hmr",
      "imports": ["react"],
      "locals": ["module"]
    })
  }

  return config;
}
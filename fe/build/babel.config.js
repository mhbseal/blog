module.exports = function (__DEVELOPMENT__, __CLIENT__) {
  var
    config = {
      stage: 0
    };

  if (__DEVELOPMENT__) {
    config.plugins = ["react-transform"];
    config.extra = {};
    config.extra["react-transform"] = {
      transforms: [{
        "transform": "react-transform-catch-errors",
        "imports": ["react", "redbox-react"]
      }]
    }
  }

  if (__DEVELOPMENT__ && __CLIENT__) {
    config.extra["react-transform"].transforms.push({
      "transform": "react-transform-hmr",
      "imports": ["react"],
      "locals": ["module"]
    })
  }

  return config;
}

export function editOver (promise, parent, url) {
  promise.then((data) => {
    if (url && data.status.code == 0) {
      parent.props.push(url);
    }
  });
};

export function deleteOver (promise, parent) {
  promise.then((data) => {
    if (data.status.code == 0) {
      parent.props.replace(location.pathname + location.search + location.hash);
    }
  });
};
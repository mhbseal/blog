export function editOver (promise, parent, url) {
  promise.then((data) => {
    if (url && data.status.code == 0) {
      parent.props.push(url);
    }
  });
};

export function deleteOver (promise, parent, x) {
  let params = parent.props.location.query;

  if (x) {
    params = {...params, x};
  }

  promise.then((data) => {
    if (data.status.code == 0) {
      setTimeout(() => {
        parent.props.load({params});
      }, 0)
    }
  });
};
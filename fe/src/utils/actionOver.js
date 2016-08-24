export function editOver (promise, parent, url) {
  promise.then((data) => {
    parent.setState({showAlert: true});
    if (url && data.status === 'success') {
      setTimeout(() => {
        parent.props.push(url);
      }, 500)
    }
  }, () => {
    parent.setState({showAlert: true});
  });
};

export function deleteOver (promise, parent, x) {
  let params = parent.props.location.query;

  if (x) {
    params = {...params, x};
  }

  promise.then(() => {
    parent.setState({showAlert: true});
    parent.props.load({params});
  }, () => {
    parent.setState({showAlert: true});
  });
};
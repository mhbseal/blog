import React, { Component, PropTypes } from 'react';

export default class Loading extends Component {
  render() {
    let {loading, msg} = this.props;
    if (loading) {
      return (
        <div className="loading">
          <div className="loading_layer"><img src="/static/images/loading.gif" />{msg ? msg : '加载中...'}</div>
        </div>
      );
    } else {
      return null;
    }
  }
}
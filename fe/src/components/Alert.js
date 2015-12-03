import React, { Component, PropTypes } from 'react';

export default class Alert extends Component {
  render() {
    let {showAlert, validateMsg, loading, data, error} = this.props;

    if (showAlert) {
      if (validateMsg) {
        return <span className="alert alert-warning">{validateMsg}</span>
      } else if (loading) {
        return <span className="alert alert-info">'提交中...</span>
      }  else if (data && data.status === 'success') {
        return <span className="alert alert-success">{data.msg}</span>
      } else if(error || data && data.status !== 'success') {
        return <span className="alert alert-danger">{error ? '网络错误，请稍后重试...' : data.msg}</span>
      }
    }

    return <span></span>;
  }
}
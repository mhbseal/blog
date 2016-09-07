import { Component, PropTypes } from 'react';

export default class Message extends Component {
  render() {
    let {loading, data, error} = this.props;
var msg;
    if (loading) {
     msg = '提交中';
    } else if(error || data && data.status.code != 0) {
      msg = error ? '网络错误，请稍后重试...' : data.status.msg;
    }

    return (
      <div className="message">
        <div className="message_layer">{msg}</div>
      </div>
    );
  }
}
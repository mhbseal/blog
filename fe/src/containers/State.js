import React, { Component } from 'react';

export default class State extends Component {
  render() {
    let {loading, error, data} = this.props;

    return (
      <section className="contents">
        {loading ? '正在努力加载中...' :
          error ? '网络错误，请稍后重试...' :
            data.status.code != 0 ? data.status.msg : ''}
      </section>
    )
  }
}
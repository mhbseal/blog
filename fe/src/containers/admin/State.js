import React, { Component } from 'react';
import { Link } from 'react-router';

export default class State extends Component {
  render() {
    let {loading, error, data} = this.props;

    return (
      <div className="main">
        {loading ? '正在努力加载中...' :
          error ? '网络错误，请稍后重试...' :
            data.msg === '登陆验证失败' ? <p>登陆验证失败,请 <Link to={ADMINPATH + 'login'}>登陆</Link></p> :
              data.status !== 'success' ? data.msg : ''}
      </div>
    )
  }
}
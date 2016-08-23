import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { load } from '../../redux/modules/admin/auth';
import { asyncConnect } from 'redux-connect';
import State from './State';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return dispatch(load());
  }
}])
@connect(
  state => ({
    auth: state.adminAuth
  })
)
export default class Welcome extends Component {
  render() {
    let auth = this.props.auth;

    if (auth.data && auth.data.data) {
      let name = auth.data.data.admin.name;
      return (
        <div className="main">
          <div className="welcome">
            <h1>欢迎{name ? ' ' + name + '!' : <span>! <Link to={ADMINPATH + 'login'}>请登陆</Link></span>}</h1>
          </div>
        </div>
      )
    } else {
      return <State {...auth} />
    }
  }
}
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { load } from '../../redux/modules/admin/auth';
import { asyncConnect } from 'redux-connect';
import Prompt from '../../components/Prompt';

@asyncConnect([{
  promise: ({store: {dispatch}}) => {
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
    let
      auth = this.props.auth,
      page;

    if (auth.loadData && auth.loadData.data) {
      let name = auth.loadData.data.admin.name;

      page = (
        <div className="main">
          <div className="welcome">
            <h1>欢迎{name ? ' ' + name + '!' : <span>! <Link to={ADMINPATH + 'login'}>请登陆</Link></span>}</h1>
          </div>
        </div>
      )
    }

    return (
      <Prompt {...auth}>
        {page}
      </Prompt>
    )
  }
}
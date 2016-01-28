import React, { Component } from 'react';
import { connect } from 'react-redux';
import connectData from '../../helpers/connectData';
import Alert from '../../components/Alert';
import formatForm from '../../utils/formatForm';
import { editOver } from '../../utils/actionOver';
import * as authActions from '../../redux/modules/admin/auth';
import State from './State';
import { pushState } from 'redux-router';

function fetchData(getState, dispatch) {
  return dispatch(authActions.load());
}

@connectData(fetchData)
@connect(
  state => ({
    auth: state.adminAuth
  }),
  { ...authActions, pushState }
)
export default class Login extends Component {
  state = {
    validateMsg: null,
    showAlert: false
  }
  render() {
    let
      auth = this.props.auth;

    if (auth.data && auth.data.data) {
      let {admin} = auth.data.data;
      return (
        <div className="main">
          <table className="table1">
            <tbody>
            <tr>
              <td className="td1">&nbsp;</td>
              <td><h2>登陆</h2></td>
            </tr>
            <tr>
              <td className="td1">邮箱：</td>
              <td><input type="text" ref="email" className="form-control" defaultValue={admin.email} /></td>
            </tr>
            <tr>
              <td className="td1">密码：</td>
              <td><input type="password" ref="password" className="form-control" defaultValue={admin.email ? '******' : ''} /></td>
            </tr>
            <tr>
              <td className="td1">&nbsp;</td>
              <td>
                <a href="javascript:void(0)" onClick={::this.handleSubmit} className="btn">确定</a>&nbsp;&nbsp;
                <Alert data={auth.loginData} loading={auth.loggingIn} error={auth.loginError} validateMsg={this.state.validateMsg} showAlert={this.state.showAlert} />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      return <State {...auth} />
    }
  }
  handleSubmit() {
    let
      data = formatForm(this, [
        {
          name: 'email',
          rules: ['isRequired', 'isEmail'],
          msgs: ['邮箱不能为空！', '邮箱格式不正确！']
        }, {
          name: 'password',
          rules: ['isRequired'],
          msgs: ['密码不能为空！']
        }
      ]),
      props = this.props;

    // 提交
    if (data) {
      editOver(props.login(data), this, String(ADMINPATH));
    }
  }
}
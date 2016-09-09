import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Alert from '../../components/Alert';
import formatForm from '../../utils/formatForm';
import { editOver } from '../../utils/actionOver';
import * as authActions from '../../redux/modules/admin/auth';
import Prompt from '../../components/Prompt';
import { push } from 'react-router-redux';

@asyncConnect([{
  promise: ({store: {dispatch}}) => {
    return dispatch(authActions.load());
  }
}])
@connect(
  state => ({
    auth: state.adminAuth
  }),
  { ...authActions, push }
)
export default class Login extends Component {
  state = {
    validateMsg: null,
    showAlert: false
  }
  render() {
    let
      auth = this.props.auth,
      page;

    if (auth.loginData && auth.loginData.data) {
      let {admin} = auth.loginData.data;
      
      page = (
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
                <a href="javascript:void(0)" onClick={::this.handleSubmit} className="btn">确定</a>
                <Prompt data={auth.loginData} loading={auth.logining} error={auth.loginError} loadingMsg="登陆中..." />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <Prompt {...auth}>
        {page}
      </Prompt>
    )
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
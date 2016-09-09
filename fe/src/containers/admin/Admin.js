import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Alert from '../../components/Alert';
import formatForm from '../../utils/formatForm';
import { editOver } from '../../utils/actionOver';
import * as detailActions from '../../redux/modules/admin/admin';
import Prompt from '../../components/Prompt';
import { push } from 'react-router-redux';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return dispatch(detailActions.load({params: {x: 'admin', id: location.query.id}}));
  }
}])
@connect(
  state => ({
    detail: state.adminAdmin
  }),
  { ...detailActions, push }
)
export default class Admin extends Component {
  state = {
    validateMsg: null,
    showAlert: false
  }
  render() {
    let
      detail = this.props.detail,
      page;

    if (detail.loadData && detail.loadData.data) {
      let {xData} = detail.loadData.data;
      
      page = (
        <div className="main admin">
          <table className="table1">
            <tbody>
            <tr>
              <td className="td1">&nbsp;</td>
              <td><h2>{xData._id ? '编辑' : '新增'}</h2></td>
            </tr>
            <tr>
              <td className="td1">账号：</td>
              <td><input type="text" ref="name" className="form-control" defaultValue={xData.name} /></td>
            </tr>
            <tr>
              <td className="td1">邮箱：</td>
              <td><input type="text" ref="email" className="form-control" defaultValue={xData.email} /></td>
            </tr>
            <tr>
              <td className="td1">密码：</td>
              <td><input type="password" ref="password" className="form-control" /></td>
            </tr>
            <tr>
              <td className="td1">&nbsp;</td>
              <td>
                <a href="javascript:void(0)" className="btn" onClick={this.handleSubmit.bind(this, xData._id)}>确定</a>&nbsp;&nbsp;
                <Prompt loadData={detail.editData} loading={detail.editing} loadError={detail.editError} loadingMsg="提交中..." className='inline'>
                  <Alert validateMsg={this.state.validateMsg} />
                </Prompt>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <Prompt {...detail}>
        {page}
      </Prompt>
    )
  }
  handleSubmit(id) {
    let
      data = formatForm(this, [
        {
          name: 'name',
          rules: ['isRequired'],
          msgs: ['账号不能为空！']
        }, {
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
      if (id) {
        editOver(props.update({params: {x: 'admin', id}, data}), this, ADMINPATH + 'adminList');
      } else {
        editOver(props.create({params: {x: 'admin'}, data}), this, ADMINPATH + 'adminList');
      }
    }
  }
}
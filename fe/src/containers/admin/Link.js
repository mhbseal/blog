import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Alert from '../../components/Alert';
import formatForm from '../../utils/formatForm';
import { editOver } from '../../utils/actionOver';
import * as detailActions from '../../redux/modules/admin/link';
import Prompt from '../../components/Prompt';
import { push } from 'react-router-redux';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return dispatch(detailActions.load({params: {x: 'link', id: location.query.id}}));
  }
}])
@connect(
  state => ({
    detail: state.adminLink
  }),
  { ...detailActions, push }
)
export default class Link extends Component {
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
        <div className="main">
          <table className="table1">
            <tbody>
            <tr>
              <td className="td1">&nbsp;</td>
              <td><h2>{xData._id ? '编辑' : '新增'}</h2></td>
            </tr>
            <tr>
              <td className="td1">名称：</td>
              <td><input type="text" ref="name" className="form-control" defaultValue={xData.name} /></td>
            </tr>
            <tr>
              <td className="td1">链接：</td>
              <td><input type="text" ref="url" className="form-control wd4" defaultValue={xData.url} /></td>
            </tr>
            <tr>
              <td className="td1">&nbsp;</td>
              <td>
                <a href="javascript:void(0)" className="btn" onClick={this.handleSubmit.bind(this, xData._id)}>确定</a>&nbsp;&nbsp;
                <Prompt data={detail.editData} loading={detail.editing} error={detail.editError} loadingMsg="提交中..." className='inline'>
                  <Alert validateMsg={this.state.validateMsg} />
                </Prompt></td>
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
          msgs: ['名称不能为空！']
        }, {
          name: 'url',
          rules: ['isRequired', 'isUrl'],
          msgs: ['链接不能为空！', '链接格式错误！']
        }
      ]),
      props = this.props;

    // 提交
    if (data) {
      if (id) {
        editOver(props.update({params: {x: 'link', id}, data}), this, ADMINPATH + 'linkList');
      } else {
        editOver(props.create({params: {x: 'link'}, data}), this, ADMINPATH + 'linkList');
      }
    }
  }
}
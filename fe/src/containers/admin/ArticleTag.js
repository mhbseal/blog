import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Alert from '../../components/Alert';
import formatForm from '../../utils/formatForm';
import { editOver } from '../../utils/actionOver';
import * as detailActions from '../../redux/modules/admin/articleTag';
import Prompt from '../../components/Prompt';
import { push } from 'react-router-redux';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return dispatch(detailActions.load({params: {x: 'articleTag', id: location.query.id}}));
  }
}])
@connect(
  state => ({
    detail: state.adminArticleTag
  }),
  { ...detailActions, push }
)
export default class ArticleTag extends Component {
  state = {
    validateMsg: null
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
              <td className="td1">路径：</td>
              <td><input type="text" ref="path" className="form-control" defaultValue={xData.path} /></td>
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
          msgs: ['名称不能为空！']
        }, {
          name: 'path',
          rules: ['isRequired'],
          msgs: ['路径不能为空！']
        }
      ]),
      props = this.props;

    // 提交
    if (data) {
      if (id) {
        editOver(props.update({params: {x: 'articleTag', id}, data}), this, ADMINPATH + 'articleTagList');
      } else {
        editOver(props.create({params: {x: 'articleTag'}, data}), this, ADMINPATH + 'articleTagList');
      }
    }
  }
}
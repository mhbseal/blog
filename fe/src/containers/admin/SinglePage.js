import React, { Component } from 'react';
import DocumentMeta from 'react-document-meta';
import { connect } from 'react-redux';
import connectData from '../../helpers/connectData';
import Alert from '../../components/Alert';
import formatForm from '../../utils/formatForm';
import { editOver } from '../../utils/actionOver';
import * as detailActions from '../../redux/modules/admin/singlePage';
import State from './State';
import m from '../../utils/moReactUtils';
import { pushState } from 'redux-router';

let contentEditor;

function fetchData(getState, dispatch, location) {
  return dispatch(detailActions.load({params: {x: 'singlePage', id: location.query.id}}));
}

@connectData(fetchData)
@connect(
  state => ({
    detail: state.adminSinglePage
  }),
  { ...detailActions, pushState }
)
export default class singlePage extends Component {
  state = {
    validateMsg: null,
    showAlert: false
  }
  componentDidMount() {
    let
      detail = this.props.detail;
    // 引入umeditor
    if (detail.data && detail.data.data && detail.data.data.useEditor) {
      m.createStyle('/static/scripts/umeditor/themes/default/css/umeditor.css');
      m.createScript('/static/scripts/umeditor/third-party/jquery.min.js', function() {
        m.createScript('/static/scripts/umeditor/umeditor.config.js', function() {
          m.createScript('/static/scripts/umeditor/umeditor.min.js', function() {
            m.createScript('/static/scripts/umeditor/lang/zh-cn/zh-cn.js', function() {
              contentEditor = UM.getEditor('content');
            })
          })
        })
      })
    }
  }
  render() {
    let
      detail = this.props.detail;

    if (detail.data && detail.data.data) {
      let {xData} = detail.data.data;
      return (
        <div className="main">
          <DocumentMeta script={{}}/>
          <table className="table1" ref="form">
            <tbody>
            <tr>
              <td className="td1">&nbsp;</td>
              <td><h2>{xData._id ? '编辑' : '新增'}</h2></td>
            </tr>
            <tr>
              <td className="td1">名称：</td>
              <td><input type="text" ref="title" className="form-control" defaultValue={xData.title} /></td>
            </tr>
            <tr>
              <td className="td1">路径：</td>
              <td><input type="text" ref="path" className="form-control wd4" defaultValue={xData.path} /></td>
            </tr>
            <tr>
              <td className="td1">内容：</td>
              <td dangerouslySetInnerHTML={{__html: `<script type="text/plain" id="content" style="width: 900px;">${xData.content != null ? xData.content : ''}</script>`}}></td>
            </tr>
            <tr>
              <td className="td1">&nbsp;</td>
              <td>
                <a href="javascript:void(0)" className="btn" onClick={this.handleSubmit.bind(this, xData._id)}>确定</a>&nbsp;&nbsp;
                <Alert data={detail.editData} loading={detail.editing} error={detail.editError} validateMsg={this.state.validateMsg} showAlert={this.state.showAlert} />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      return <State {...detail} />
    }
  }
  handleSubmit(id) {
    let
      data = formatForm(this, [
        {
          name: 'title',
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
      data.content = contentEditor.getContent();
      if (id) {
        editOver(props.update({params: {x: 'singlePage', id}, data}), this, ADMINPATH + 'singlePageList');
      } else {
        editOver(props.create({params: {x: 'singlePage'}, data}), this, ADMINPATH + 'singlePageList');
      }
    }
  }
}
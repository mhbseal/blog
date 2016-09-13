import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Alert from '../../components/Alert';
import formatForm from '../../utils/formatForm';
import { editOver } from '../../utils/actionOver';
import * as detailActions from '../../redux/modules/admin/singlePage';
import Prompt from '../../components/Prompt';
import m from '../../utils/moReactUtils';
import { push } from 'react-router-redux';

let contentEditor;

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return dispatch(detailActions.load({params: {x: 'singlePage', id: location.query.id}}));
  }
}])
@connect(
  state => ({
    detail: state.adminSinglePage
  }),
  { ...detailActions, push }
)
export default class SinglePage extends Component {
  state = {
    validateMsg: null
  }
  componentDidMount() {
    let
      detail = this.props.detail;
    // 引入umeditor
    if (detail.loadData && detail.loadData.data && detail.loadData.data.useEditor) {
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
      detail = this.props.detail,
      page;

    if (detail.loadData && detail.loadData.data) {
      let {xData} = detail.loadData.data;

      page = (
        <div className="main">
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
                <Prompt loadData={detail.editData} loading={detail.editing} loadError={detail.editError} loadingMsg="提交中..." className='inline'>
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
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Alert from '../../components/Alert';
import formatForm from '../../utils/formatForm';
import { editOver } from '../../utils/actionOver';
import * as articleActions from '../../redux/modules/admin/article';
import Prompt from '../../components/Prompt';
import m from '../../utils/moReactUtils';
import { push } from 'react-router-redux';

let contentEditor, introEditor;

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return dispatch(articleActions.load({params: {id: location.query.id}}));
  }
}])
@connect(
  state => ({
    article: state.adminArticle
  }),
  { ...articleActions, push }
)
export default class Article extends Component {
  state = {
    validateMsg: null,
    showAlert: false
  }
  componentDidMount() {
    let
      article = this.props.article;
    // 引入umeditor
    if (article.data && article.data.data) {
      m.createStyle('/static/scripts/umeditor/themes/default/css/umeditor.css');
      m.createScript('/static/scripts/umeditor/third-party/jquery.min.js', function() {
        m.createScript('/static/scripts/umeditor/umeditor.config.js', function() {
          m.createScript('/static/scripts/umeditor/umeditor.min.js', function() {
            m.createScript('/static/scripts/umeditor/lang/zh-cn/zh-cn.js', function() {
              introEditor = UM.getEditor('introduction');
              contentEditor = UM.getEditor('content');
            })
          })
        })
      })
    }
  }
  render() {
    let
      articleProps = this.props.article,
      page;

    if (articleProps.loadData && articleProps.loadData.data) {
      let {article, articleTypes, articleTags} = articleProps.loadData.data;

      page = (
        <div className="main">
          <table className="table1">
            <tbody>
            <tr>
              <td className="td1">&nbsp;</td>
              <td><h2>{article._id ? '编辑' : '新增'}</h2></td>
            </tr>
            <tr>
              <td className="td1">标题：</td>
              <td><input type="text" ref="title" className="form-control wd4" defaultValue={article.title} /></td>
            </tr>
            <tr>
              <td className="td1">作者：</td>
              <td><input type="text" ref="author" className="form-control" defaultValue={article.author} /></td>
            </tr>
            <tr>
              <td className="td1">所属类别：</td>
              <td>
                <select ref="type" defaultValue={String(article.type)} className="form-control">
                  {articleTypes.map((v, i) => {
                    return <option key={i} value={v._id}>{v.name}</option>
                  })}
                </select>
              </td>
            </tr>
            <tr>
              <td className="td1">标签：</td>
              <td>
                {articleTags.map((v, i) => {
                  return <span key={i}><input ref={'tags' + i} type="checkbox" value={v._id} defaultChecked={article.tags && ~article.tags.indexOf(v._id) ? true : false} /> {v.name} </span>
                })}
              </td>
            </tr>
            <tr>
              <td className="td1">是否启用：</td>
              <td>
                <select ref="enabled" defaultValue={article.enabled} className="form-control">
                  <option value={true}>是</option>
                  <option value={false}>否</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="td1">简介：</td>
              <td dangerouslySetInnerHTML={{__html: `<script type="text/plain" id="introduction" style="width: 900px;">${article.introduction != null ? article.introduction : ''}</script>`}}></td>
            </tr>
            <tr>
              <td className="td1">内容：</td>
              <td dangerouslySetInnerHTML={{__html: `<script type="text/plain" id="content" style="width: 900px;">${article.content != null ? article.content : ''}</script>`}}></td>
            </tr>
            <tr>
              <td className="td1">&nbsp;</td>
              <td>
                <a href="javascript:void(0)" className="btn" onClick={this.handleSubmit.bind(this, article._id)}>确定</a>&nbsp;&nbsp;
                <Prompt data={articleProps.editData} loading={articleProps.editing} error={articleProps.editError} loadingMsg="提交中..." className='inline'>
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
      <Prompt {...articleProps}>
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
          msgs: ['标题不能为空！']
        }, {
          name: 'author',
          rules: ['isRequired'],
          msgs: ['作者不能为空！']
        },{
          name: 'type',
          rules: ['isRequired'],
          msgs: ['类别不能为空']
        }, {
          names: 'tags'
        }, {
          name: 'enabled'
        }
      ]),
      props = this.props;

    // 提交
    if (data) {
      data.introduction = introEditor.getContent();
      data.content = contentEditor.getContent();
      if (id) {
        editOver(props.update({params: {id}, data}), this, ADMINPATH + 'articleList');
      } else {
        editOver(props.create({data}), this, ADMINPATH + 'articleList');
      }
    }
  }
}

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { load, insertComment, addStar } from '../redux/modules/article';
import { asyncConnect } from 'redux-connect';
import Alert from '../components/Alert';
import formatForm from '../utils/formatForm';
import { create as createComment } from '../redux/modules/comment';
import { create as createStar } from '../redux/modules/articleStar';
import Prompt from '../components/Prompt';
import globalLoading from '../utils/globalLoading';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return globalLoading(dispatch(load({params: location.query})), dispatch);
  }
}])
@connect(
  state => ({
    article: state.article,
    layout: state.layout,
    comment: state.comment
  }),
  { createComment, insertComment, createStar, addStar }
)

export default class Article extends Component {
  state = {
    validateMsg: null
  }
  render() {
    let
      props = this.props,
      articleProps = props.article,
      comment = props.comment || {};

    if (articleProps.loadData && articleProps.loadData.data) {
      let
        {blogInfo} = props.layout.loadData.data,
        {article, comments, commenter} = articleProps.loadData.data;

      return (
        <section className="contents">
          <Helmet title={`${article.title}_${article.type.name}_${blogInfo.title}`}/>
          <article className="detail">
            <header>
              <h2>{article.title}</h2>
              <i className="icon-user3"></i>
              <span>{article.author}</span>
              <i className="icon-clock2"></i>
              <span>{article.createTime.slice(0, 10)}</span>
              <i className="icon-eye"></i>
              <span>{article.visits}</span>
              <i className="icon-star" onClick={this.handleStar.bind(this, article._id)}></i>
              <span onClick={this.handleStar.bind(this, article._id)}>{article.stars}</span>
              <i className="icon-comments"></i>
              <span>{comments.length}</span>
            </header>
            <section className="info" dangerouslySetInnerHTML={{__html: article.content}}></section>
            <footer>
              <span>
                <i className="icon-tags"></i>
                {article.tags.map((tag, i) => {
                  return <Link key={i} to='/' query={{tagPath: tag.path}}>{(i ? ' ' : '') + tag.name}</Link>
                })}
              </span>
            </footer>
          </article>
          <section className="comment">
            <div style={{display: comments.length ? 'block' : 'none'}}>
              <h3>留言列表</h3>
              <ul>
                {comments.map((comment, i) => {
                  return (
                    <li key={i}>
                      <div className="info">
                        <img src={comment.user && comment.user.img || comment.admin && comment.admin.img}/>
                        <strong>{comment.user && comment.user.name || comment.admin && comment.admin.name}</strong><br/>
                        <span>{comment.time}</span><br/>
                      </div>
                      <div className="content">{comment.content}<br/><a href="javascript:void(0)" onClick={this.handleReply.bind(this, comment.user && comment.user.name || comment.admin && comment.admin.name)}>回复</a></div>
                    </li>
                  )
                })}
              </ul>
            </div>
            <h3>发表评论</h3>
            <table>
              <tbody>
              <tr>
                <td>昵称：</td>
                <td><input ref="name" type="text" className="form-control" defaultValue={commenter.name} /></td>
              </tr>
              <tr>
                <td>邮箱：</td>
                <td><input ref="email" type="text" className="form-control" defaultValue={commenter.email} /></td>
              </tr>
              <tr>
                <td>内容：</td>
                <td><textarea ref="content" className="form-control"></textarea></td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td>
                  <a href="javascript:void(0)" onClick={this.handleSubmit.bind(this, {id: article._id, typePath: article.type.path})} className="btn">发表评论</a>&nbsp;&nbsp;
                  <Prompt data={comment.editData} loading={comment.editing} error={comment.editError} loadingMsg="提交中..." className='inline'>
                    <Alert validateMsg={this.state.validateMsg} />
                  </Prompt>
                </td>
              </tr>
              </tbody>
            </table>
          </section>
        </section>
      )
    } else {
      return null;
    }
  }
  handleSubmit(article) {
    let
      data = formatForm(this, [
        {
          name: 'name',
          rules: ['isRequired'],
          msgs: ['昵称不能为空！']
        }, {
          name: 'email',
          rules: ['isRequired', 'isEmail'],
          msgs: ['邮箱不能为空！', '邮箱格式不正确！']
        }, {
          name: 'content',
          rules: ['isRequired'],
          msgs: ['内容不能为空！']
        }
      ]),
      props = this.props;

    // 提交
    if (data) {
      props.createComment({ data: {...data, article} }).then((data) => {
        if (data.status.code == 0) {
          this.refs.content.value = '';
          props.insertComment(data.data);
        }
      });
    }
  }
  handleReply(name) {
    let content = this.refs.content;
    content.focus();
    content.value = `@${name} - `;
  }
  handleStar(id) {
    // 点赞功能不管是否成功,直接+1
    let props = this.props;
    props.createStar({params: {id}});
    props.addStar();
  }
}
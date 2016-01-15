import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { load } from '../../redux/modules/admin/articleList';
import { del } from '../../redux/modules/admin/article';
import connectData from '../../helpers/connectData';
import Alert from '../../components/Alert';
import PageList from '../../components/PageList';
import State from './State';
import { deleteOver } from '../../utils/actionOver';

function fetchData(getState, dispatch, location) {
  return dispatch(load({params: {...location.query}}));
}

@connectData(fetchData)
@connect(
  state => ({
    articleList: state.adminArticleList,
    article: state.adminArticle
  }),
  { del, load }
)
export default class ArticleList extends Component {
  state = {
    showAlert: false
  }
  render() {
    let
      props = this.props,
      articleList = props.articleList,
      article = props.article;

    if (articleList.data && articleList.data.data) {
      let
        {articles, articleTypes, pageList} = articleList.data.data;

      return (
        <div className="main admin">
          <Link to={ADMINPATH + 'article'} className="btn">新增</Link>&nbsp;&nbsp;
          <Alert data={article.deleteData} loading={article.deleteing} error={article.deleteError} showAlert={this.state.showAlert} />
          <div className="table2_wrap">
            <table className="table2">
              <tbody>
              <tr>
                <th>序号</th>
                <th>标题</th>
                <th>作者</th>
                <th>阅读次数</th>
                <th>所属类别</th>
                <th>标签</th>
                <th>留言数</th>
                <th>添加时间</th>
                <th>最后编辑时间</th>
                <th>已发布</th>
                <th>操作</th>
                <th></th>
              </tr>
              {articles.map((article, i) => {
                return (
                  <tr key={i}>
                    <td>{(pageList.current - 1) * pageList.size + i + 1}</td>
                    <td>{article.title.slice(0, 25) + (article.title.length > 25 ? '...' : '')}</td>
                    <td>{article.author}</td>
                    <td>{article.visits}</td>
                    <td>{article.type.name}</td>
                    <td>
                      {article.tags.map((tag, i) => {
                        return (i !== 0 ? '、' : '') + tag.name
                      })}
                    </td>
                    <td><Link to={ADMINPATH + 'commentList'} query={{'article.id': article._id}}>{article.commentCount}</Link></td>
                    <td>{article.createTime.slice(0, 10)}</td>
                    <td>{article.lastEditTime.slice(0, 10)}</td>
                    <td>{article.enabled ? '是' : '否'}</td>
                    <td>
                      <Link to={ADMINPATH + 'article'} query={{id: article._id}}>编辑</Link>&nbsp;&nbsp;
                      <a href="javascript:void(0)" onClick={this.handleDelete.bind(this, article._id)}>删除</a>
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
          <PageList {...pageList} path={ADMINPATH + 'articleList'} />
        </div>
      )
    } else {
      return <State {...articleList} />
    }
  }
  handleDelete(id) {
    deleteOver(this.props.del({params: {id}}), this);
  }
};
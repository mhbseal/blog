import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { load, addStar } from '../redux/modules/articleList';
import { create as createStar } from '../redux/modules/articleStar';
import { asyncConnect } from 'redux-connect';
import PageList from '../components/PageList';
import globalLoading from '../utils/globalLoading';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return globalLoading(dispatch(load({params: location.query})), dispatch);
  }
}])
@connect(
  state => ({
    articleList: state.articleList,
    layout: state.layout
  }),
  { createStar, addStar }
)
export default class ArticleList extends Component {
  render() {
    let
      props = this.props,
      articleList = props.articleList;

    if (articleList.loadData && articleList.loadData.data) {
      let
        {blogInfo} = props.layout.loadData.data,
        {typeOrTagName, articles, pageList} = articleList.loadData.data;

      return (
        <section className="contents">
          <Helmet title={(typeOrTagName ? typeOrTagName + '_' : '') + blogInfo.title}/>
          {articles.map((article, i) => {
            return (
              <article key={i} className="excerpt">
                <header>
                  <span className="icon-pencil"></span>
                  <h2><Link to='/article' query={{id: article._id}} title={article.title}>{article.title}</Link></h2>
                  <div>
                    <i className="icon-user3"></i><span>{article.author}</span>
                    <i className="icon-clock2"></i><span>{article.createTime.slice(0, 10)}</span>
                    <i className="icon-eye"></i><span>{article.visits}</span>
                    <i className="icon-star" onClick={this.handleStar.bind(this, article._id, i)}></i>
                    <span onClick={this.handleStar.bind(this, article._id, i)}>{article.stars}</span>
                    <i className="icon-comments"></i><span>{article.commentCount}</span>
                  </div>
                </header>
                <section className="info" dangerouslySetInnerHTML={{__html: article.introduction}}></section>
                <footer>
                  <span>
                    <i className="icon-tags"></i>
                    {article.tags.map((tag, i) => {
                      return <Link key={i} to='/' query={{tagPath: tag.path}}>{(i ? ' ' : '') + tag.name}</Link>
                    })}
                  </span>
                  <Link to='/article' query={{id: article._id}} title={article.title} className="more"><i className="icon-forward"></i> more</Link>
                </footer>
              </article>
            )
          })}
          <PageList {...pageList} path='/' />
        </section>
      )
    } else {
      return null;
    }
  }
  handleStar(id, i) {
    // 点赞功能不管是否成功,直接+1
    let props = this.props;
    props.createStar({params: {id}});
    props.addStar(i);
  }
};
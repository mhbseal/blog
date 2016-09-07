import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { load } from '../redux/modules/articleList';
import { asyncConnect } from 'redux-connect';
import PageList from '../components/PageList';
import Message from '../components/Message';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return dispatch(load({params: location.query}));
  }
}])
@connect(
  state => ({
    articleList: state.articleList,
    layout: state.layout
  })
)
export default class ArticleList extends Component {
  render() {
    let
      props = this.props,
      articleList = props.articleList,
      Content = [];
    // if (articleList.data && articleList.data.data) {
    //   let
    //     {blogInfo} = props.layout.data.data,
    //     {typeOrTagName, articles, pageList} = articleList.data.data;
    //
    //   Content.push(
    //     <section className="contents">
    //       <Helmet title={(typeOrTagName ? typeOrTagName + '_' : '') + blogInfo.title}/>
    //       {articles.map((article, i) => {
    //         return (
    //           <article key={i} className="excerpt">
    //             <header>
    //               <span className="icon-pencil"></span>
    //               <h2><Link to='/article' query={{id: article._id}} title={article.title}>{article.title}</Link></h2>
    //               <div>
    //                 <i className="icon-user3"></i><span>{article.author}</span>
    //                 <i className="icon-clock2"></i><span>{article.createTime.slice(0, 10)}</span>
    //                 <i className="icon-eye"></i><span>{article.visits}</span>
    //                 <i className="icon-comments"></i><span>{article.commentCount}</span>
    //               </div>
    //             </header>
    //             <section className="info" dangerouslySetInnerHTML={{__html: article.introduction}}></section>
    //             <footer>
    //             <span>
    //               <i className="icon-tags"></i>
    //               {article.tags.map((tag, i) => {
    //                 return <Link key={i} to='/' query={{tagPath: tag.path}}>{(i ? ' ' : '') + tag.name}</Link>
    //               })}
    //             </span>
    //               <Link to='/article' query={{id: article._id}} title={article.title} className="more"><i className="icon-forward"></i> more</Link>
    //             </footer>
    //           </article>
    //         )
    //       })}
    //       <PageList {...pageList} path='/' />
    //     </section>
    //   )
    // }
    // Content.push()
    return <Message {...articleList} />;
  }
};
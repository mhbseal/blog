import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { Link } from 'react-router';
import { isLoaded, load } from '../../redux/modules/admin/blogInfo';
import connectData from '../../helpers/connectData';
import classNames from 'classnames';
import '../layout.scss';

function fetchData(getState, dispatch) {
  if (!isLoaded(getState())) {
    return dispatch(load());
  }
}

@connectData(fetchData)
@connect(
  state => ({blogInfo: state.adminBlogInfo})
)
export default class Layout extends Component {
  render() {
    let blogInfoProps = this.props.blogInfo;

    if (blogInfoProps.data && blogInfoProps.data.data) {
      let
        {blogInfo} = blogInfoProps.data.data;
      return (
        <div className="admin">
          <DocumentMeta title='后台管理'/>
          <header className="header">
            <div className="inner">
              <h1><Link to={String(ADMINPATH)} className="logo">{blogInfo.title} 后台管理</Link></h1>
              <div className="icon-menu"></div>
              <nav id="nav">
                <Link to={ADMINPATH + 'blogInfo'}>博客信息</Link>
                <Link to={ADMINPATH + 'articleList'}>文章</Link>
                <Link to={ADMINPATH + 'articleTypeList'}>文章类型</Link>
                <Link to={ADMINPATH + 'articleTagList'}>标签云</Link>
                <Link to={ADMINPATH + 'commentList'}>评论</Link>
                <Link to={ADMINPATH + 'singlePageList'}>单页面</Link>
                <Link to={ADMINPATH + 'userList'}>用户</Link>
                <Link to={ADMINPATH + 'adminList'}>管理员</Link>
                <Link to={ADMINPATH + 'linkList'}>友情链接</Link>
              </nav>
            </div>
          </header>
          {this.props.children}
          <footer className="footer" dangerouslySetInnerHTML={{__html: blogInfo.copyright}}></footer>
        </div>
      )
    } else {
      return (
        <div className="welcome">
          <DocumentMeta title='500 Error'/>
          <h1>网络错误，请稍后重试...</h1>
        </div>
      )
    }
  }
};
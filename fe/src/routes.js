import React from 'react';
import { IndexRoute, Route, Router } from 'react-router';
// 前台
import Layout from './containers/Layout';
import ArticleList from './containers/ArticleList';
import Article from './containers/Article';
import SinglePage from './containers/SinglePage';
import NotFound from './containers/NotFound';
// 后台
import AdminLayout from './containers/admin/Layout';
import AdminWelcome from './containers/admin/Welcome';
import AdminLogin from './containers/admin/Login';
import AdminAdmin from './containers/admin/Admin';
import AdminAdminList from './containers/admin/AdminList';
import AdminArticleTag from './containers/admin/ArticleTag';
import AdminArticleTagList from './containers/admin/ArticleTagList';
import AdminArticleType from './containers/admin/ArticleType';
import AdminArticleTypeList from './containers/admin/ArticleTypeList';
import AdminLink from './containers/admin/Link';
import AdminLinkList from './containers/admin/LinkList';
import AdminSinglePage from './containers/admin/SinglePage';
import AdminSinglePageList from './containers/admin/SinglePageList';
import AdminUserList from './containers/admin/UserList';
import AdminCommentList from './containers/admin/CommentList';
import AdminBlogInfo from './containers/admin/BlogInfo';
import AdminArticle from './containers/admin/Article';
import AdminArticleList from './containers/admin/ArticleList';

export default () => {
  return (
    <Router>
      <Route path="/" component={Layout}>
        <IndexRoute component={ArticleList} />
        <Route path="article" component={Article} />
        <Route path="singlePage" component={SinglePage} />
      </Route>
      <Route path={String(ADMINPATH).slice(0, -1)} component={AdminLayout}>
        <IndexRoute component={AdminWelcome} />
        <Route path="login" component={AdminLogin} />
        <Route path="admin" component={AdminAdmin} />
        <Route path="adminList" component={AdminAdminList} />
        <Route path="articleTag" component={AdminArticleTag} />
        <Route path="articleTagList" component={AdminArticleTagList} />
        <Route path="articleType" component={AdminArticleType} />
        <Route path="articleTypeList" component={AdminArticleTypeList} />
        <Route path="link" component={AdminLink} />
        <Route path="linkList" component={AdminLinkList} />
        <Route path="singlePage" component={AdminSinglePage} />
        <Route path="singlePageList" component={AdminSinglePageList} />
        <Route path="userList" component={AdminUserList} />
        <Route path="commentList" component={AdminCommentList} />
        <Route path="blogInfo" component={AdminBlogInfo} />
        <Route path="article" component={AdminArticle} />
        <Route path="articleList" component={AdminArticleList} />
      </Route>
      <Route path="*" component={NotFound} status={404} />
    </Router>
  );
};
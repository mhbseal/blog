import React from 'react';
import { IndexRoute, Route, Router } from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth, clearLogin } from './redux/modules/admin/auth';
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

export default (store) => {
  // 校验登陆
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      if (!isAuthLoaded(store.getState())) {
        // oops, not logged in, so can't be here!
        store.dispatch(clearLogin());
        replace(ADMINPATH + 'login');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth, checkAuth);
    } else {
      checkAuth();
    }
  };

  return (
    <Router>
      <Route path="/" component={Layout}>
        <IndexRoute component={ArticleList} />
        <Route path="article" component={Article} />
        <Route path="singlePage" component={SinglePage} />
      </Route>
      <Route path={String(ADMINPATH).slice(0, -1)} component={AdminLayout}>
        <IndexRoute component={AdminWelcome} onEnter={requireLogin} />
        <Route path="login" component={AdminLogin} />
        <Route path="admin" component={AdminAdmin} onEnter={requireLogin} />
        <Route path="adminList" component={AdminAdminList} onEnter={requireLogin} />
        <Route path="articleTag" component={AdminArticleTag} onEnter={requireLogin} />
        <Route path="articleTagList" component={AdminArticleTagList} onEnter={requireLogin} />
        <Route path="articleType" component={AdminArticleType} onEnter={requireLogin} />
        <Route path="articleTypeList" component={AdminArticleTypeList} onEnter={requireLogin} />
        <Route path="link" component={AdminLink} onEnter={requireLogin} />
        <Route path="linkList" component={AdminLinkList} onEnter={requireLogin} />
        <Route path="singlePage" component={AdminSinglePage} onEnter={requireLogin} />
        <Route path="singlePageList" component={AdminSinglePageList} onEnter={requireLogin} />
        <Route path="userList" component={AdminUserList} onEnter={requireLogin} />
        <Route path="commentList" component={AdminCommentList} onEnter={requireLogin} />
        <Route path="blogInfo" component={AdminBlogInfo} onEnter={requireLogin} />
        <Route path="article" component={AdminArticle} onEnter={requireLogin} />
        <Route path="articleList" component={AdminArticleList} onEnter={requireLogin} />
      </Route>
      <Route path="*" component={NotFound} status={404} />
    </Router>
  );
};
import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
// 前台
import layout from './layout';
import articleList from './articleList';
import article from './article';
import singlePage from './singlePage';
import comment from './comment';
// 后台
import adminBlogInfo from './admin/blogInfo';
import adminAuth from './admin/auth';
import adminList from './admin/list';
import adminDetail from './admin/detail';
import adminArticleList from './admin/articleList';
import adminArticle from './admin/article';

export default combineReducers({
  router: routerStateReducer,
  layout,
  articleList,
  article,
  singlePage,
  comment,
  adminBlogInfo,
  adminAuth,
  adminList,
  adminDetail,
  adminArticleList,
  adminArticle
});
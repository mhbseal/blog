import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';
// 前台
import layout from './layout';
import articleList from './articleList';
import article from './article';
import singlePage from './singlePage';
import comment from './comment';
// 后台
import adminBlogInfo from './admin/blogInfo';
import adminAuth from './admin/auth';
import adminArticleList from './admin/articleList';
import adminAdminList from './admin/adminList';
import adminArticleTagList from './admin/articleTagList';
import adminArticleTypeList from './admin/articleTypeList';
import adminUserList from './admin/userList';
import adminCommentList from './admin/commentList';
import adminLinkList from './admin/linkList';
import adminSinglePageList from './admin/singlePageList';
import adminArticle from './admin/article';
import adminAdmin from './admin/admin';
import adminArticleTag from './admin/articleTag';
import adminArticleType from './admin/articleType';
import adminUser from './admin/user';
import adminComment from './admin/comment';
import adminLink from './admin/link';
import adminSinglePage from './admin/singlePage';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  // 前台
  layout,
  articleList,
  article,
  singlePage,
  comment,
  //// 后台
  adminBlogInfo,
  adminAuth,
  adminArticleList,
  adminAdminList,
  adminArticleTagList,
  adminArticleTypeList,
  adminUserList,
  adminCommentList,
  adminLinkList,
  adminSinglePageList,
  adminArticle,
  adminAdmin,
  adminArticleTag,
  adminArticleType,
  adminUser,
  adminComment,
  adminLink,
  adminSinglePage
});
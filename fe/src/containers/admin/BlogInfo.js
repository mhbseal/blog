import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import connectData from '../../helpers/connectData';
import Alert from '../../components/Alert';
import formatForm from '../../utils/formatForm';
import { editOver } from '../../utils/actionOver';
import * as blogInfoActions from '../../redux/modules/admin/blogInfo';
import State from './State';
import { pushState } from 'redux-router';

function fetchData(getState, dispatch, location) {
  return dispatch(blogInfoActions.load());
}

@connectData(fetchData)
@connect(
  state => ({
    blogInfo: state.adminBlogInfo
  }),
  { ...blogInfoActions, pushState }
)
export default class BlogInfo extends Component {
  state = {
    validateMsg: null,
    showAlert: false
  }
  render() {
    let
      blogInfoProps = this.props.blogInfo,
      {blogInfo, logined} = blogInfoProps.data.data;

    if (logined) {
      return (
        <div className="main">
          <table className="table1">
            <tbody>
            <tr>
              <td className="td1">&nbsp;</td>
              <td><h2>博客信息管理</h2></td>
            </tr>
            <tr>
              <td className="td1">标题：</td>
              <td><input type="text" ref="title" className="form-control wd3" defaultValue={blogInfo.title}/></td>
            </tr>
            <tr>
              <td className="td1">关键词：</td>
              <td><textarea ref="keywords" className="form-control wd6 hg1" defaultValue={blogInfo.keywords}/></td>
            </tr>
            <tr>
              <td className="td1">描述：</td>
              <td><textarea ref="description" className="form-control wd6 hg1" defaultValue={blogInfo.description}/></td>
            </tr>
            <tr>
              <td className="td1">版权：</td>
              <td><textarea ref="copyright" className="form-control wd6 hg1" defaultValue={blogInfo.copyright}/></td>
            </tr>
            <tr>
              <td className="td1">&nbsp;</td>
              <td>
                <a href="javascript:void(0)" className="btn" onClick={this.handleSubmit.bind(this, blogInfo._id)}>确定</a>&nbsp;&nbsp;
                <Alert data={blogInfoProps.editData} loading={blogInfoProps.editing} error={blogInfoProps.editError} validateMsg={this.state.validateMsg} showAlert={this.state.showAlert}/>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      return <div className="main"><p>登陆验证失败,请 <Link to={ADMINPATH + 'login'}>登陆</Link></p></div>
    }
  }
  handleSubmit(id) {
    let
      data = formatForm(this, [
        {
          name: 'title',
          rules: ['isRequired'],
          msgs: ['标题不能为空！']
        }, {
          name: 'keywords',
          rules: ['isRequired'],
          msgs: ['关键词不能为空！']
        }, {
          name: 'description',
          rules: ['isRequired'],
          msgs: ['描述不能为空！']
        }, {
          name: 'copyright',
          rules: ['isRequired'],
          msgs: ['版权不能为空！']
        }
      ]),
      props = this.props;

    // 提交
    if (data) {
      if (id) {
        editOver(props.update({params: {id}, data}), this);
      } else {
        editOver(props.create({data}), this);
      }
    }
  }
}
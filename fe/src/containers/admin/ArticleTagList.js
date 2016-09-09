import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { load } from '../../redux/modules/admin/articleTagList';
import { del } from '../../redux/modules/admin/articleTag';
import { asyncConnect } from 'redux-connect';
import PageList from '../../components/PageList';
import Prompt from '../../components/Prompt';
import { deleteOver } from '../../utils/actionOver';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return dispatch(load({params: {...location.query, x: 'articleTag'}}));
  }
}])
@connect(
  state => ({
    list: state.adminArticleTagList,
    detail: state.adminArticleTag
  }),
  { del, load }
)
export default class ArticleTagList extends Component {
  state = {
    showAlert: false
  }
  render() {
    let
      props = this.props,
      list = props.list,
      detail = props.detail,
      page;

    if (list.loadData && list.loadData.data) {
      let
        {xData, pageList} = list.loadData.data;

      page = (
        <div className="main">
          <Link to={ADMINPATH + 'articleTag'} className="btn">新增</Link>
          <div className="table2_wrap">
            <table className="table2">
              <tbody>
              <tr>
                <th>序号</th>
                <th>名称</th>
                <th>路径</th>
                <th>操作</th>
              </tr>
              {xData.map((x, i) => {
                return (
                  <tr key={i}>
                    <td>{(pageList.current - 1) * pageList.size + i + 1}</td>
                    <td>{x.name}</td>
                    <td>{x.path}</td>
                    <td>
                      <Link to={ADMINPATH + 'articleTag'} query={{id: x._id}}>编辑</Link>&nbsp;&nbsp;
                      <a href="javascript:void(0)" onClick={this.handleDelete.bind(this, x._id)}>删除</a>
                      <Prompt data={detail.deleteData} loading={detail.deleteing} error={detail.deleteError} loadingMsg="删除中..." />
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
          <PageList {...pageList} path={ADMINPATH + 'articleTagList'} />
        </div>
      )
    }

    return (
      <Prompt {...list}>
        {page}
      </Prompt>
    )
  }
  handleDelete(id) {
    deleteOver(this.props.del({params: {x: 'articleTag', id}}), this, 'articleTag');
  }
};
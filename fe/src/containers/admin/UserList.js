import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { load } from '../../redux/modules/admin/userList';
import { del } from '../../redux/modules/admin/user';
import connectData from '../../helpers/connectData';
import Alert from '../../components/Alert';
import PageList from '../../components/PageList';
import State from './State';

function fetchData(getState, dispatch, location) {
  return dispatch(load({params: {...location.query, x: 'user'}}));
}

@connectData(fetchData)
@connect(
  state => ({
    list: state.adminUserList,
    detail: state.adminUser
  }),
  { del, load }
)
export default class UserList extends Component {
  state = {
    showAlert: false
  }
  render() {
    let
      props = this.props,
      list = props.list,
      detail = props.detail;

    if (list.data && list.data.data) {
      let
        {xData, pageList} = list.data.data;

      return (
        <div className="main">
          <Alert data={detail.deleteData} loading={detail.deleteing} error={detail.deleteError} showAlert={this.state.showAlert} />
          <div className="table2_wrap">
            <table className="table2">
              <tbody>
              <tr>
                <th>序号</th>
                <th>昵称</th>
                <th>邮箱</th>
                <th>评论数</th>
                <th>操作</th>
              </tr>
              {xData.map((x, i) => {
                return (
                  <tr key={i}>
                    <td>{(pageList.current - 1) * pageList.size + i + 1}</td>
                    <td>{x.name}</td>
                    <td>{x.email}</td>
                    <td><Link to={ADMINPATH + 'commentList'} query={{userId: x._id}}>{x.commentCount}</Link></td>
                    <td>
                      <a href="javascript:void(0)" onClick={this.handleDelete.bind(this, x._id)}>删除</a>
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
          <PageList {...pageList} path={ADMINPATH + 'userList'} />
        </div>
      )
    } else {
      return <State {...list} />
    }
  }
  handleDelete(id) {
    let props = this.props;

    props.del({params: {x: 'user', id}}).then(() => {
      this.setState({showAlert: true});
      props.load({params: {...props.location.query, x: 'user'}});
    }, () => {
      this.setState({showAlert: true});
    });
  }
};
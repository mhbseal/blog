import React, { Component, PropTypes } from 'react';

let Timer;

export default class Toast extends Component {
  state = {
    showToast: false
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.msg) {
      this.setState({showToast: true});
      clearTimeout(Timer);
      Timer = setTimeout(() => {
        this.setState({showToast: false});
      }, 1500);
    }
  }
  render() {
    let {loading, msg} = this.props;

    if (this.state.showToast && !loading && msg) {
      return (
        <div className="toast">{msg}</div>
      );
    } else {
      return null;
    }
  }
}
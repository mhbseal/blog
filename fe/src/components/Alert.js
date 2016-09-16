import React, { Component, PropTypes } from 'react';

export default class Alert extends Component {
  render() {
    let validateMsg = this.props.validateMsg;
    
    if (validateMsg) {
      return <span className="alert alert-warning">{this.props.validateMsg}</span>
    } else {
      return null;
    }
  }
}
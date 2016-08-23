import React, { Component } from 'react';
import Helmet from 'react-helmet';

export default class NotFound extends Component {
  render() {
    return (
      <section className="contents">
        <Helmet title='404 Not Found'/>
        <em>404, Not Found...</em>
      </section>
    )
  }
}
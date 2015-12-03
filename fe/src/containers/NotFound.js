import React, { Component } from 'react';
import DocumentMeta from 'react-document-meta';

export default class NotFound extends Component {
  render() {
    return (
      <section className="contents">
        <DocumentMeta title='404 Not Found'/>
        <em>404, Not Found...</em>
      </section>
    )
  }
}
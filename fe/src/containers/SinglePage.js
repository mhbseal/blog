import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { load } from '../redux/modules/singlePage';
import connectData from '../helpers/connectData';
import State from './State';

function fetchData(getState, dispatch, location) {
  return dispatch(load({params: location.query}));
}

@connectData(fetchData)
@connect(
  state => ({
    singlePage: state.singlePage,
    layout: state.layout
  })
)
export default class singlePage extends Component {
  render() {
    let
      props = this.props,
      singlePageProps = props.singlePage;

    if (singlePageProps.data && singlePageProps.data.data) {
      let
        {blogInfo} = props.layout.data.data,
        singlePage = singlePageProps.data.data;

      return (
        <section className="contents">
          <DocumentMeta title={`${singlePage.title}_${blogInfo.title}`}/>
          <article className="detail">
            <header>
              <h2>{singlePage.title}</h2>
            </header>
            <section className="info" dangerouslySetInnerHTML={{__html: singlePage.content}}></section>
          </article>
        </section>
      )
    } else {
      return <State {...singlePageProps} />
    }
  }
}
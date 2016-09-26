import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { load } from '../redux/modules/singlePage';
import { asyncConnect } from 'redux-connect';
import globalLoading from '../utils/globalLoading';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return globalLoading(dispatch(load({params: location.query})), dispatch);
  }
}])
@connect(
  state => ({
    singlePage: state.singlePage,
    layout: state.layout
  })
)
export default class SinglePage extends Component {
  render() {
    let
      props = this.props,
      singlePageProps = props.singlePage;

    if (singlePageProps.loadData && singlePageProps.loadData.data) {
      let
        {blogInfo} = props.layout.loadData.data,
        singlePage = singlePageProps.loadData.data;

      return (
        <section className="contents">
          <Helmet title={`${singlePage.title}_${blogInfo.title}`}/>
          <article className="detail">
            <header>
              <h2>{singlePage.title}</h2>
            </header>
            <section className="info" dangerouslySetInnerHTML={{__html: singlePage.content}}></section>
          </article>
        </section>
      )
    } else {
      return null;
    }
  }
}
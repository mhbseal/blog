import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { load } from '../redux/modules/singlePage';
import { asyncConnect } from 'redux-connect';
import Prompt from '../components/Prompt';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return dispatch(load({params: location.query}));
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
      singlePageProps = props.singlePage,
      page;

    if (singlePageProps.loadData && singlePageProps.loadData.data) {
      let
        {blogInfo} = props.layout.loadData.data,
        singlePage = singlePageProps.loadData.data;

      page = (
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
    }

    return (
      <Prompt {...singlePageProps}>
        {page}
      </Prompt>
    )
  }
}
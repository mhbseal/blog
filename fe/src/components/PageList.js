import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class Pagelist extends Component {
  render() {
    let
      { rowCount, numRange, current, query, pageCount, path } = this.props,
      pagelistComponent = [];

    if (rowCount > 0) {
      let
        pagePrev = current - 1,
        pageNext = current + 1,
        pageNumPrev = current - numRange,
        pageNumNext = pageNext,
        i = 0,
        j = 0;

      if (pagePrev > 0) {
        pagelistComponent.push(
          <Link key="pagestart" to={path} query={{...query, page: 1}} className="pagestart">«</Link>,
          <Link key="pageprev" to={path} query={{...query, page: pagePrev}} className="pageprev">‹&nbsp;</Link>
        )
      } else {
        pagelistComponent.push(
          <span key="pagestart" className="pagestart">«</span>,
          <span key="pageprev" className="pageprev">‹&nbsp;</span>
        )
      }
      while(i < numRange) {
        if (pageNumPrev > 0) {
          pagelistComponent.push(<Link key={pageNumPrev} to={path} query={{...query, page: pageNumPrev}}>{pageNumPrev}</Link>);
        }
        pageNumPrev++; i++;
      }
      pagelistComponent.push(<span key={current} className="active">{current}</span>);
      while(j < numRange) {
        if (pageNumNext <= pageCount) {
          pagelistComponent.push(<Link key={pageNumNext} to={path} query={{...query, page: pageNumNext}}>{pageNumNext}</Link>);
          pageNumNext++;
        } else {
          break;
        }
        j++;
      }
      if (pageNext <= pageCount) {
        pagelistComponent.push(
          <Link key="pagenext" to={path} query={{...query, page: pageNext}} className="pagenext">&nbsp;›</Link>,
          <Link key="pageend" to={path} query={{...query, page: pageCount}} className="pageend">»</Link>
        );
      } else {
        pagelistComponent.push(
          <span key="pagenext" className="pagenext">&nbsp;›</span>,
          <span key="pageend" className="pageend">»</span>
        );
      }
      pagelistComponent.push(<span key="total" className="total">{`${rowCount}条/共${pageCount}页`}</span>);
    } else {
      pagelistComponent.push(<em key="none">无记录</em>);
    }

    return (
      <div className="pagelist">
        {pagelistComponent}
      </div>
    )
  }
}
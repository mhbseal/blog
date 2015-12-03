import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentMeta from 'react-document-meta';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import { isLoaded, load } from '../redux/modules/layout';
import connectData from '../helpers/connectData';
import classNames from 'classnames';
import m from '../utils/moReactUtils';
import './layout.scss';

function fetchData(getState, dispatch) {
  if (!isLoaded(getState())) {
    return dispatch(load());
  }
}

let timer;

@connectData(fetchData)
@connect(
  state => ({layout: state.layout}),
  { pushState }
)
export default class Layout extends Component {
  state = {
    showNav: false,
    showHeaderDown: false
  }
  componentDidMount() {
    let
      colors = this.refs.colors.childNodes,
      tagColors = ['F99', 'C9C', 'F96', '6CC', '6C9', '37A7FF', 'B0D686', 'E6CC6E', 'EF8203', 'FF5E52'];

    for (let i in colors) {
      if (colors[i].tagName === 'A') {
        colors[i].style.background = '#' + tagColors[Math.floor(Math.random() * tagColors.length)];
      }
    }

    m(window).on('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    m(window).off('scroll', this.handleScroll);
  }
  render() {
    let layout = this.props.layout;

    if (layout.data && layout.data.data) {
      let
        {showNav, showHeaderDown} = this.state,
        {articleTypes, blogInfo, articleTags, links} = layout.data.data;
      return (
        <div className="index">
          <header className={classNames('header', {header_down: showHeaderDown})}>
            <div className="inner">
              <h1><Link to="/" className="logo">{blogInfo.title}</Link></h1>
              <div className="icon-menu" onClick={this.handleToggleNav}></div>
              <nav className={classNames({active: showNav})}>
                <Link to='/'>主页</Link>
                {articleTypes.map((v, i) => {
                  return <Link key={i} to='/' query={{typePath: v.path}}>{v.name}</Link>
                })}
                <Link to='/singlePage' query={{path: 'api'}}>API</Link>
                <Link to='/singlePage' query={{path: 'about'}}>关于</Link>
              </nav>
            </div>
          </header>
          <div className="main">
            {this.props.children}
            <aside className="sidebar">
              <section>
                <h3>搜索</h3>
                <div id="search" className="search">
                  <input ref="search" type="text" placeholder="关键字" className="form-control" />
                  <a href="javascript:void(0)" onClick={this.handleSearch} className="btn">GO</a>
                </div>
              </section>
              <section ref="colors">
                <h3>标签云</h3>
                {articleTags.map((tag, i) => {
                  return <Link key={i} to='/' query={{tagPath: tag.path}} className="label">{tag.name}</Link>
                })}
              </section>
              <section>
                <h3>友情链接</h3>
                <ul>
                  {links.map((link, i) => {
                    return <li key={i}><a href={link.url} title={link.name} target="_blank">{link.name}</a></li>
                  })}
                </ul>
              </section>
            </aside>
          </div>
          <footer className="footer" dangerouslySetInnerHTML={{__html: blogInfo.copyright}}></footer>
        </div>
      )
    } else {
      return (
        <div className="welcome">
          <DocumentMeta title='500 Error'/>
          <h1>网络错误，请稍后重试...</h1>
        </div>
      )
    }
  }
  handleToggleNav = () => {
    this.setState({showNav: !this.state.showNav});
  }
  handleSearch = () => {
    const
      search = this.refs.search,
      val = search.value;

    if (val === '') {
      alert('搜索内容不能为空！');
      return;
    }

    this.props.pushState(null, '/', {keyword: search.value});
    search.value = '';
  }
  handleScroll = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (document.body.scrollTop > 0) {
        this.setState({showHeaderDown: true});
      } else {
        this.setState({showHeaderDown: false});
      }
    }, 200)
  }
};
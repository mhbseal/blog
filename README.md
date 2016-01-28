# Blog

[![build status](https://img.shields.io/travis/mhbseal/blog/master.svg?style=flat-square)](https://travis-ci.org/mhbseal/blog)

### 前言

后端：express + co + mongoose + ...  
前端：react + redux + react-router + ...  
线上地址：http://mhbseal.com  

### 准备

安装 nodejs(>=4) 和 mongodb(且启动)

### 运行
    
    git clone https://github.com/mhbseal/blog  // 仓库
    cd blog && npm install  // 安装（可能有点慢）
    npm run build // 只需要第一次运行,同构工具[webpack-isomorphic-tools]所需
    npm run dev  // 启动(mac下命令,windows貌似不支持node & node,详见package中dev,多行命令吧)
    npm run dev.noauth  // 启动（初次运行，用此模式，可免登陆进入后台）
    
### 说明

1.访问地址

    http://localhost:3004  // 前台地址
    http://localhost:3004/admin  // 后台地址
      
2.几个config文件

    /be/config/  //后端配置文件（数据库、session等）
    /fe/src/config/  // 前端配置文件（后台访问目录路径）
    /env.config.js  // 2个server的host和port

### 更新日志

**0.4.0（2015-12-03）**  
服务一分为2（apiServer + renderServer），基于react + redux + react-router，对renderServer实现前后端同构，首次加载走服务端，脚本加载后走客户端。

1.整体代码架构优化  
2.前后端同构

**0.3.0（2015-08-07）**  
基于express + co + mongoose，又重写了blog（代码量不是很大），并对代码结构进行了优化，why？see 0.2.0

1.后台免登陆  
2.blog说明

**0.2.0（2015-06-09）**  
基于koa + mongoose，重写了blog，新增了n多功能，并优化了代码，换的目的是体验一下TJ大神的co，用起来确实很nice，但是目前看来和express相比，koa不是很活跃，另外middleware这块...

1.后台权限  
2.文章分类自定义  
3.文章搜索  
4.文章留言  
5.单页面  
6.SEO  
7.后台地址自定义  
8.标签云  
9.友情链接

**0.1.0（2013-10-15）**  
基于express + mongoose，最简单文章发布系统。

1.文章发布  
2.文章分类  
3.后台管理

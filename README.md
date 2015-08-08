# Blog
### 基于express+co+mongoose，线上地址http://mhbseal.com

### 准备

安装nodejs和mongodb

### 运行
    
    git clone https://github.com/mhbseal/blog // 仓库
    cd blog && npm install // 安装
    npm start // 启动
    npm run start.noauth // 启动(初次运行，用此模式，可免登陆进入后台)
    
### 说明

1.访问地址

    http://localhost:3000 // 前台地址
    http://localhost:3000/admin // 后台地址
    
2.初次运行程序用免登陆模式，进后台设置管理员账号密码  
3.后台编辑器采用ueditor，地址 http://ueditor.baidu.com/website/download.html ，下载后对应blog目录为/blog/resource/fe/static/scripts/umeditor  
4.如果需要ueditor支持文件上传，则需修改config文件umeditor.config.js中的2个参数

    imageUrl: "upload" // 文件上传
    imagePath: "" // 文件上传
    topOffset: 62 // 这个参数为解决滚动时ueditor样式

### 更新日志

**0.3.0（2015-08-07）**  
基于express+co+mongoose，又重写了blog（代码量不是很大），并对代码结构进行了优化，why？see 0.2.0

1.后台免登陆  
2.blog说明

**0.2.0（2015-06-09）**  
基于koa+mongoose，重写了blog，新增了n多功能，并优化了代码，换的目的是体验一下TJ大神的co，用起来确实很nice，但是目前看来和express相比，koa不是很活跃，另外middleware这块...

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
基于express+mongoose，最简单文章发布系统。

1.文章发布  
2.文章分类  
3.后台管理

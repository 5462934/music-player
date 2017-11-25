'use strict';
const config = require('./config');
// 引入express对象
const express = require('express');
// 创建服务器
let app = express();
// 开启服务器监听端口
app.listen(config.web_port,()=>{
    console.log('服务器启动在9999端口');
});
// 引入处理post请求提对象
const bodyParser = require('body-parser');
//引入session
const session = require('express-session');
const api_router = require('./web_router');
const user_router = require('./user_router');
const music_router = require('./music_router');


//配置模板引擎
app.engine('html', require('express-art-template') );

// 处理静态资源，向外暴露
app.use('/public', express.static('./public'));
// 在路由使用session之前，先产生session
app.use(session({
    secret: 'itcast', //唯一标识，必填
    resave: false,
    //true强制保存,不管有没有改动session中的数据，依然重新覆盖一次
    saveUninitialized: true,//一访问服务器就分配session
    //如果为false,当你用代码显式操作session的时候才分配
    // cookie: { secure: true // 仅仅在https下使用 }
}))

// 处理post请求体数据
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());

// 处理需要登录才能进去的页面（如果没有登陆，告诉客户让他登陆才能访问
app.use('/\/music|\/api\/.*music/', (req, res, next) => {
    if (!req.session.user) {
        return res.send(`
            请去首页登陆
            <a href="/user/login">点击</a>
        `)
    }

    next(); // 之前没有登录，登陆后，返回之前要登陆的界面
});

// 配置路由接口
// 意思是些路径的时候必须在前面加上这个路由接口/api/add-music
app.use('/api', api_router);
// // 用户界面路由
app.use('/user', user_router);
// 音乐界面路由
app.use('/music', music_router);

// 第二件事: 错误处理
app.use((err,req,res,next)=>{
    console.log(err);
    res.send(`
        <div style="background-color:yellowgreen;">
            您要访问的页面，暂时去医院了..请稍后再试..
            <a href="/">去首页</a>
        </div>
    `)
});
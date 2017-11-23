'use strict';
// 引入express对象
const express = require('express');
// 创建服务器
let app = express();
// 开启服务器监听端口
app.listen(9999,()=>{
    console.log('服务器启动在9999端口');
});
// 引入数据库操作db对象
const db = require('./models/db');



//配置模板引擎
app.engine('html', require('express-art-template') );

app.use(router);
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
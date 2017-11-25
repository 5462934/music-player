'use strict'
const express = require('express');

const userController = require('./controllers/userController');
const musicController = require('./controllers/musicController');

// 配置路由规则
let router = express.Router();

router.post('/check-user', userController.checkUser)// 检查用户名是否存在
.post('/do-register', userController.doRegister)// 注册
.post('/do-login', userController.doLogin)// 登录
.get('/logout', userController.logout)// 退出
.post('/add-music',  musicController.addMusic)// 添加音乐
.put('/edit-music', musicController.updateMusic) // 更新音乐
.delete('/del-music', musicController.delMusic) // 删除音乐

// 配置路由规则结束
module.exports = router;
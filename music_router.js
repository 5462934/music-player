'use strict';

const express = require('express');
const musicController = require('./controllers/musicController');
// 配置路由规则
let router = express.Router();

router.get('/add-music', musicController.addMusic)// 添加音乐
.get('/list-music', musicController.showListMusic);// 显示音乐列表

// 配置路由规则结束

module.exports = router;
'use strict';

const express = require('express');
const userController = require('./controllers/userController.js');

let router = express.Router();

router.get('/login', userController.showLogin)// 显示登录页

.get('/register', userController.showRegister)// 注册页

module.exports = router;
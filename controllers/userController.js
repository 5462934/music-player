'use strict';

const db = require('../models/db');

// 首先声明userController为一个对象，里面包含多个函数
let userController = {

};

/**
 * 检查用户名是否存在
 */

 userController.checkUser = (req, res, next) => {
   let username = req.body.username;
   db.q('select * from users where username = ?', [username], (err, data) => {
     if(err) return next(err);

    //  console.log(data);
     // 判断是否有数据
     if (data.length == 0) {
       // 没有数据，可以注册
      res.json({
        code: '001', msg: '用户名可以注册'
      })
     } else {
       res.json({
         code: '002', msg: '用户名已经存在'
       })
     }
   });
 }

 /**
  * 注册
  */

  userController.doRegister = (req, res, next) => {
    let userData = req.body;
    let username = userData.username;
    let password = userData.password;
    let v_code = userData.v_code;
    let email = userData.email;

    // 验证邮箱
    let regex = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if (!regex.test(email)) {
      // 邮箱不符合
      res.json({
        code: '004', msg: '邮箱不合法'
      })
      return;
    }
     // 验证用户名或者邮箱是否存在
     db.q('select * from users where username = ? or email = ?', [username, email], (err, data) => {
       if(err) return next(err);
       if(data.length != 0) {
         // 有可能邮箱存在，有可能用户名存在
         let user = data[0];
         if(user.email == email) {
            return res.json({
              code: '002', msg: '邮箱已经注册'
            })
         }else if (user.username == username) {
            return res.json({
              code: '002', msg: '用户名已经注册'
            })
        } 
       } else {
         // 用户名和邮箱都不存在，可以注册
         db.q('insert into users (username, password, email) values (?, ?, ?)', [username, password, email], (err, result) => {
           if(err) return next(err);
           console.log(result);
           res.json({
             code: '001', msg: '注册成功'
           })
         })
       }
     })
  };


  /**
   * 登录
   */

   userController.doLogin = (req, res, next) => {
     // 接收参数
     let username = req.body.username;
     let password = req.body.password;
     let remember_me = req.body.remember_me;
     // 将用户名作为条件查询数据库
     db.q('select * from users where username = ?', [username], (err, data) => {
       if(err) return next(err);
       if(data.length == 0) {
         return res.json({
           code: '002', msg: '用户名或密码不对'
         })
       }

       // 找到了用户
       let dbUser = data[0];
      //  console.log(dbUser);
       if(dbUser.password != password) {
         return res.json({
           code: '002', msg: '用户名或密码不正确'
         })
       }

       // 给session上存储用户数据
       //{ username: 'a', password: '123456', id: 1, email: '123@qq.com' }
       req.session.user = dbUser;

       // 用户名密码正确，传输数据
       res.json({
         code: '001', msg: '登录成功'
       })
     })
   };


   /**
    * 退出
    */

    // userController.logout = (req, res, next) => {
    //   // 从session中删除user
    // }

  


module.exports = userController;
 


'use strict';
const db = require('../models/db');
// 解析文件上传
const formidable = require('formidable');

// 引入path核心对象
const path = require('path');

// 引入配置对象
const config = require('../config');


/**
   * 添加音乐
   * 原来这里的函数名字不能包含-这个
   */
exports.addMusic = (req, res, next) => {
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(config.rootPath, 'public/files');
  form.parse(req, function (err, fields, files) {
    if (err) return next(err);
    // 获取字段添加进数组
    let datas = [fields.title, fields.singer, fields.time];
    let sql = 'insert into musics (title, singer, time, ';
    let params = '(?, ?, ?';
    //两个路径
    // console.log(files);
    if (files.file) {
      //获取文件名
      let filename = path.parse(files.file.path).base;
      //如果上传了文件
      datas.push(`/public/files/${filename}`);
      sql += 'file,';
      params += ', ?';
    }
    if (files.filelrc) {
      //获取文件名
      let lrcname = path.parse(files.filelrc.path).base;
      //如果上传了文件
      datas.push(`/public/files/${lrcname}`);
      sql += 'filelrc,';
      params += ', ?';
    }
    params += ', ?)';
    sql += 'uid) values ';
    //用户的id
    datas.push(req.session.user.id);
    //插入音乐数据
    db.q(sql + params, datas, (err, data) => {
      res.json({
        code: '001',
        msg: '添加音乐成功'
      });
    });
  });
};

/**
 * 更新音乐
 */

exports.updateMusic = (req, res, next) => {
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(config.rootPath, 'public/files');
  form.parse(req, function (err, fields, files) {
    if (err) return next(err);
    let sql = 'update musics set title = ?, singer = ?, time = ?,';
    let datas = [fields.title, fields.singer, fields.time];

    if (files.file) {
      let filename = path.parse(files.file.path).base;
      console.log(filename);
      // 如果上传了文件
      datas.push(`/public/files/${filename}`);
      sql += 'file = ?,';
    }

    if (files.filelrc) {
      // 获取文件名
      let lrcname = path.parse(files.filelrc.path).base;
      // 如果上传了文件
      datas.push(`/public/files/${lrcname}`);
      sql += 'filelrc = ?,'
    }

    // 去除一个逗号
    sql = sql.substr(0, sql.length - 1);
    // 加上条件
    sql += 'where id = ?';
    datas.push(fields.id);
    // 更新音乐数据
    db.q(sql, datas, (err, data) => {
      if (err) return next(err);
      res.json({
        code: '001', msg: '更新音乐成功'
      })
    })
  })
}

/**
 * 删除音乐
 */

 exports.delMusic = (req, res, next) => {
  // 获取用户id
  let userid = req.session.user.id;
  // 获取音乐id
  let musicId = req.query.id;
  // 删除数据
  db.q('delete from musics where id = ? and uid = ?', [musicId, userid], (err, result) => {
    if (err) return next(err);

    if (result.affectedRows == 0) {
      // 歌曲不存在
      return res.json({
        code: '002', msg: '歌曲不存在'
      })
    }

    res.json({
      code: '001', msg: '删除歌曲成功'
    })
  })
 };

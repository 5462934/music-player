const config = require('./../config');
// 引入数据库对象
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: config.db_connectionLimit,
    host: config.db_host,
    user: config.db_user,
    password: config.db_password,
    database: config.db_database
});


//正常代码
let q = function(sql,props,callback){
    pool.getConnection((err, connection)=> {
        if(err)return callback(err,null);
        connection.query(sql,props,(error, results)=>{
            connection.release();
            //不管有没有error,让外部判断
            callback(error,results);
        })
    });
}

//将q向外暴露
module.exports = {
    q:q
};

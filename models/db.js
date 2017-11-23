// 引入数据库对象
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'linawei',
    database: 'node_music'
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

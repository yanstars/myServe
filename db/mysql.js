const mysql = require('mysql');
const { MYSQL } = require('../conf');

// 创建链接对象
const con = mysql.createConnection(MYSQL);

// 开始链接
con.connect();

// 统一执行 sql 的函数
async  function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
    return promise;
}

module.exports = {
    exec,
    escape: mysql.escape,
};

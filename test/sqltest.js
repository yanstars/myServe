const { exec, escape } = require('../db/mysql');
const { json } = require('express');
username = escape('zhangsan');
tele = 18382370489;

// const sql = `insert into users(username,password,tele) values(${username},${password},${tele})`;
// const sql = `select * from users where username=${username} and tele=${tele}`;
let sql =  `select id from users where tele = ${tele}`

exec(sql)
    .then((e) => {
        console.log('e',  JSON.parse(JSON.stringify(e[0])).id  );
    })
    .catch((e) => {
        console.log('e', e);
    });

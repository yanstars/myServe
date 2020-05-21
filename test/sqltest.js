const { exec, escape } = require('../db/mysql');
const { json } = require('express');
moment = require('moment');
let date = moment(new Date()).format('YYYY-MM-DD HH:mm');
date = escape(date);

// let username = escape('zhangsan');
// let page = 3;
// let tele = 18382370489;
// let tele

// const sql = `insert into users(username,password,tele) values(${username},${password},${tele})`;
// const sql = `select * from users where username=${username} and tele=${tele}`;
// const sql = `select   * ,username  from   user_pro ,users  where user_pro.id =users.id   order   by   date   desc   limit   0,5 ; `;
// const sql = `select  DISTINCT
// user_pro.prodname,user_pro.prodpath ,user_pro.title,user_pro.text,user_pro.date
// from
// user_pro ,users
// where user_pro.id = (
//     select id  from users where tele = ${user}
// )
// order  by   date   desc   limit   0,${page} ; `;

// let imgPath = 'https://i.loli.net/2017/08/21/599a521472424.jpg'
// // imgPath = escape(imgPath);
// username = escape(username);

// const usersql = `insert into user(username,tele,headImgPath) values(${username},${username},'${imgPath}');`

//  let a =  exec()

usersql = `insert into user_pro(id,prodname,prodpath,text,date) values(0000000000000030, 'mysql','http://yanstartshare.oss-cn-beijing.aliyuncs.com/183823704899527mysql.mp4','mysql',${date})`;

console.log('usersql', usersql);
exec(usersql)
    .then((e) => {
        console.log(e)
    })
    .catch((e) => {
        console.log('e', e);
    });

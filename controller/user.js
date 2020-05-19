const { exec, escape } = require('../db/mysql');
const { assignWith } = require('lodash');

// const { genPassword } = require('../utils/cryp');
// TODO 验证字符串的存入和查询问题

const login = (username, password) => {
    console.log('object', username, password);
    username = escape(username);

    // // 生成加密密码
    // password = genPassword(password);
    // password = escape(password);

    const sql = `
        select username from users where tele=${username} and password=${password}
    `;

    return exec(sql).then((rows) => {
        return rows[0] || {};
    });
};

const getlist = async (page, user = '') => {
    // let name = console.log('object', page);
    let sql;
    if (user.length) {
        sql = `select  DISTINCT
        user_pro.prodname,prodid,user_pro.prodpath ,user_pro.title,user_pro.text,user_pro.date 
        from  
        user_pro ,users
        where user_pro.id =(
            select id  from users where tele = ${user}
        )  
        order  by   date   desc   limit   0,${page} ; `;
    } else {
        sql = `select   * ,username  from   user_pro ,users  where user_pro.id =users.id   order   by   date   desc   limit   0,${page} ; `;
    }
    console.log('sql', sql);
    return exec(sql).then((e) => {
        return e;
    });
};

const signin = async (username, password, tele) => {
    console.log('object', username, password, tele);
    const imgPath = 'https://i.loli.net/2017/08/21/599a521472424.jpg';
    username = escape(username);

    // // 生成加密密码
    // password = genPassword(password);
    // password = escape(password);
    const sql = `insert into users(username,password,tele) values(${username},${password},${tele})`;
    await exec(sql);
    let id = await exec(`select id from users where tele = ${tele}`);
    id = id[0].id;
    const usersql = `insert into user(username,tele,headImgPath,id) values(${username},${username},'${imgPath}',${id});`;
    await exec(usersql);
};

const updateUserInfo = async (user, birth, info, sex, username) => {
    username = escape(username);
    info = escape(info);
    sex = escape(sex);
    birth = escape(birth);
    console.log('birth', birth);
    const sql = ` UPDATE user 
                    SET 
                            username= ${username} ,
                            birth = ${birth},
                            info = ${info},
                            sex = ${sex}
                    WHERE tele=${user};`;
    console.log('sql', sql);

    return await exec(sql);
};

const getUserInfo = async (tele) => {
    username = escape(tele);

    const sql = ` SELECT 
                username,headImgPath,sex,info,birth 
                from user
                where tele = ${tele}`;

    console.log('sql', sql);

    return await exec(sql);
};

const isCheckin = (username, tele) => {
    username = escape(username);
    const sql = `select * from users where username=${username} and tele=${tele}`;
    return exec(sql)
        .then((data) => {
            if (data.length > 0) {
                return 1;
            } else {
                return 0;
            }
        })
        .catch((e) => {
            console.warn('e', e);
        });
};

const addpost = async (tele, filename, filepath, title, text) => {
    let getid = `select id from users where tele = ${tele}`;
    let id = await exec(getid);
    id = JSON.parse(JSON.stringify(id[0])).id;
    const sql = `insert into user_pro(id,prodname,prodpath,title,text) values(${id}, '${filename}','${filepath}','${title}','${text}')`;
    console.log('sql', sql);
    return exec(sql).then((e) => {
        return e;
    });
};

const getUserInfoById = async (id) => {
    let getinfo = `select * from user where id = ${id}`;
    return exec(getinfo).then((e) => {
        return e;
    });
};

const getUserIdByName = async (name) => {
    name = escape(name);
    const getid = `select id from users where username = ${name}`;
    console.log('getid', getid)
    return exec(getid);
};

const addFans = async (id, targetid) => {
    const sql = `insert into fans (fansid,userid) values (${id},${targetid})`;
    console.log('sql', sql)
    return exec(sql);
};

// getUserInfoByName

module.exports = {
    login,
    signin,
    isCheckin,
    addpost,
    getlist,
    updateUserInfo,
    getUserInfo,
    getUserInfoById,
    getUserIdByName,
    addFans,
};

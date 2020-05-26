const { exec, escape } = require('../db/mysql');
const { assignWith } = require('lodash');

// const { genPassword } = require('../utils/cryp');

/**
 *登录
 *
 * @param {*} tele
 * @param {*} password
 * @returns
 */
const login = async (tele, password) => {
    tele = escape(tele);
    password = escape(password);
    // // 生成加密密码
    // password = genPassword(password);
    const sql = `
        select * from users where tele=${tele} and password=${password}
    `;
    let result = await exec(sql);
    return result[0];
};

/**
 *确认用户是否注册过
 *
 * @param {*} tele
 * @returns
 */
const isCheckin = async (tele) => {
    tele = escape(tele);
    const sql = `select * from users where  tele=${tele}`;
    return exec(sql);
};

/**
 *注册
 *
 * @param {*} username
 * @param {*} password
 * @param {*} tele
 * @returns
 */
const signin = async (username, password, tele) => {
    const imgPath = 'https://i.loli.net/2017/08/21/599a521472424.jpg';
    username = escape(username);
    tele = escape(tele);

    // // 生成加密密码
    // password = genPassword(password);
    // password = escape(password);

    const sql = `insert into users(tele,password) values(${tele}, ${password})`;
    let result = await exec(sql);
    result = await exec(`select id from users where tele = ${tele}`);
    let id = result[0].id;
    const usersql = `insert into user(username,tele,headImgPath,id) values(${username},${tele},'${imgPath}',${id});`;
    return await exec(usersql);
};

/**
 *根据id查找用户详细信息
 *
 * @param {*} id
 * @returns
 */
const getUserInfoById = async (id) => {
    id = escape(id);
    const sql = ` 
        SELECT 
        * 
        from user
        where id = ${id}`;

    let result = await exec(sql);

    return result[0];
};

/**
 *更新用户基础信息
 *
 * @param {*} user
 * @param {*} birth
 * @param {*} info
 * @param {*} sex
 * @param {*} username
 * @returns
 */
const updateUserInfo = async (userid, birth, info, sex, username) => {
    username = escape(username);
    info = escape(info);
    sex = escape(sex);
    birth = escape(birth);
    const sql = ` 
        UPDATE user 
        SET 
        username= ${username} ,
        birth = ${birth},
        info = ${info},
        sex = ${sex}
        WHERE id=${userid};`;

    let { warningCount } = await exec(sql);
    return warningCount;
};



// const getUserIdByName = async (name) => {
//     name = escape(name);
//     const getid = `select id from users where username = ${name}`;
//     return exec(getid);
// };

const addFans = async (id, targetid) => {
    const sql = `insert into fans (fansid,userid) values (${id},${targetid})`;
    return exec(sql);
};

const getlist = async (page, user = '') => {
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
    return exec(sql).then((e) => {
        return e;
    });
};

// getUserInfoByName

module.exports = {
    login,
    signin,
    isCheckin,
    // addpost,
    // getlist,
    updateUserInfo,
    getUserInfoById,
    // getUserIdByName,
    addFans,
};

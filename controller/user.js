const { exec, escape } = require('../db/mysql');

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

const signin = (username, password, tele) => {
    console.log('object', username, password, tele);
    username = escape(username);

    // // 生成加密密码
    // password = genPassword(password);
    // password = escape(password);

    const sql = `insert into users(username,password,tele) values(${username},${password},${tele})`;

    return exec(sql).then((e) => {
        return e;
    });
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

module.exports = {
    login,
    signin,
    isCheckin,
    addpost,
};

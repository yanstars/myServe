const { exec, escape } = require('../db/mysql');

const add = async (uid, uname, pid, pname, prodid, text, date) => {
    text = escape(text);
    pname = escape(pname);
    uname = escape(uname);
    date = escape(date);
    const sql = `insert into discuss (userid,username,pid,pname,prodid,text,date) values (${uid},${uname},${pid},${pname},${prodid},${text},${date})`;
    return exec(sql);
};

const deleteD = async (id) => {
    let sql = `select * from discuss where  discussid = ${id}`;
    let result = exec(sql);
    if (!result.lenght) {
        sql = `DELETE FROM discuss WHERE runoob_id= ${id}`;
        return exec(sql);
    }
};

const getList = async (id) => {
    const sql = `
    select distinct *
    from discuss
    where prodid = ${id}  `;
    return exec(sql);
};

const Dcollect = async (userid, id) => {
    const isCollected = `select * from collection where id = ${userid} and  prodid = ${id} and type = 0 `;
    let check = await exec(isCollected);
    if (!check.length) {
        const addCollection = `insert into collection(id,prodid,type) values(${userid},${id},0);`;
        return exec(addCollection);
    } else {
        return Promise.resolve({
            err: -1,
        });
    }
};

const Dstar = async (userid, id) => {
    let star = `select * from stars where userID = ${userid} and targetID = ${id} and isMv = 0 `;
    star = await exec(star);
    if (!star.length) {
        star = `insert into stars(userID,targetID,isMv) values(${userid},${id},0);`;
        return exec(star);
    } else {
        return Promise.resolve({
            err: -1,
        });
    }
};

module.exports = {
    add,
    deleteD,
    getList,
    Dcollect,
    Dstar
};

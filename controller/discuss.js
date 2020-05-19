const { exec, escape } = require('../db/mysql');

const add = async (id, targetid, prodid, text) => {
    text = escape(text);
    // sql = `insrt into discuss `
    const sql = `insert into discuss (userid,targetid,prodid,text) values (${id},${targetid},${prodid},${text})`;
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

module.exports = {
    add,
    deleteD,
};

const { exec, escape } = require('../db/mysql');

const add = async (id, targetid, prodid, text) => {
    text = escape(text);
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

const getList = async (id) => {
    const sql = `
    select discuss.*  ,users.username 
    from discuss,users 
    where users.id = any(
        select 
        discuss.userid
        from discuss where 
        prodid =${id} 
    )  `;
    let result1 = await exec(sql);

    const sql2 = `
    select  users.username as targetname
    from users 
    where users.id = any(
        select 
        discuss.targetid
        from discuss where 
        prodid =${id} 
    )  `;
    let result2 = await exec(sql2);
    result1[0].targetname = result2[0].targetname;
    return Promise.resolve(result1);
};

module.exports = {
    add,
    deleteD,
    getList,
};

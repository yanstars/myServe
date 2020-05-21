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
    select distinct  users.username  ,discuss.*
    from discuss,users
    where users.id  in  (
        select
        userid
        from discuss where
        prodid =${id}
    )  `;

    // const sql = `
    //     select
    //     userid
    //     from discuss where
    //     prodid =${id}
    //   `;
    let result1 = await exec(sql);
    let list = []

    result1.forEach((item, index,arr) => {
        if((index+1)%2==0){

            let obj = arr[index];
            console.log('arr[index+1]', arr[index+1])
            obj.targetusername = arr[index+1].username
            console.log('obj', obj)

            list.push(obj)

        }
    });

    console.log('arr', list)

    // const sql2 = `
    // select  users.username as targetname
    // from users
    // where users.id = any(
    //     select
    //     discuss.targetid
    //     from discuss where
    //     prodid =${id}
    // )  `;
    // let result2 = await exec(sql2);
    // result1[0].targetname = result2[0].targetname;

    // console.log('result1', result1);
    // console.log('result2', result2)
    return Promise.resolve(result1);
};

module.exports = {
    add,
    deleteD,
    getList,
};

const { exec, escape } = require('../db/mysql');
let moment = require('moment');
const e = require('express');

// const { select } = require('../db/redis');

const addpost = async (userid, prodname, cloudfilename, filepath, text) => {
    text = escape(text);
    prodname = escape(prodname);
    filepath = escape(filepath);
    cloudfilename = escape(cloudfilename);
    let date = moment(new Date()).format('YYYY-MM-DD HH:mm');
    date = escape(date);
    const sql = `insert into user_pro(id,prodname,cloudfilename,prodpath,text,date) values(${userid}, ${prodname},${cloudfilename},${filepath},${text},${date})`;
    let { warningCount } = await exec(sql);
    return warningCount;
};
// 根据 prodid 获取 cloud filename

const getProdCloudName = async (prodid) => {
    const sql = `select cloudfilename from user_pro where prodid = ${prodid}`;
    let result = await exec(sql);
    return result[0].cloudfilename;
};

// 根据 用户id 查找 用户作品列表

const getUserPostListById = async (id) => {
    const sql = `select * from user_pro where id = ${id}`;
    return exec(sql).then((e) => {
        return e;
    });
};
// 删除 用户的帖子

const deleteProMv = async (userid, prodid) => {
    const sql = `DELETE FROM user_pro WHERE prodid=${prodid} and id =${userid} ;`;
    return exec(sql);
};

// 添加 收藏 作品
const collectProductById = async (userid, productid) => {
    const isCollected = `select * from collection where id = ${userid} and  prodid = ${productid}  `;
    console.log('isCollected :>> ', isCollected);
    let check = await exec(isCollected);
    if (!check.length) {
        const addCollection = `insert into collection(id,prodid) values(${userid},${productid});`;
        console.log('添加收藏 :>> ', addCollection);
        return exec(addCollection);
    } else {
        return Promise.resolve({
            err: -1,
        });
    }
    // collection
    // prodid id
    //  16     8
};

const getCollectedList = async (userid) => {
    const sql = `
    select  DISTINCT
        user_pro.prodname,users.username,user_pro.prodid,user_pro.prodpath ,user_pro.title,user_pro.text,user_pro.date 
        from  
        user_pro ,collection , users
        where user_pro.prodid = any (
            select collection.prodid  from collection where id = ${userid}  and users.id = ${userid}
        ) `;

    console.log('获取收藏列表 :>> ', sql);
    return exec(sql);
};

const getPostlist = async (page, user = 0) => {
    let sql;
    if (user != 0) {
        sql = `
            select  DISTINCT
            *
            from  
            user_pro 
            where user_pro.id =(
                select id  from users where id = ${user}
            )  
            order  by   date   desc   limit   0,${page} ; `;
    } else {
        sql = `select   DISTINCT
        user_pro.* , user.username  
        from 
        user_pro ,user  
        where
        user_pro.id =user.id 
        order   by 
        date   desc  
        limit   0,${page} ; `;
    }
    return exec(sql).then((e) => {
        return e;
    });
};

module.exports = {
    getUserPostListById,
    collectProductById,
    getCollectedList,
    getPostlist,
    addpost,
    getProdCloudName,
    deleteProMv,
};

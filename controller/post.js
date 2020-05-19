const { exec, escape } = require('../db/mysql');
// const { select } = require('../db/redis');

// 根据 用户id 查找 用户作品列表

const getUserPostListById = async (id) => {
    const sql = `select * from user_pro where id = ${id}`;
    return exec(sql).then((e) => {
        return e;
    });
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


// 删除 post

const deletePostByPid =async (prodid) =>{


}


module.exports = {
    getUserPostListById,
    collectProductById,
    getCollectedList,
    deletePostByPid
};

const { exec, escape } = require('../db/mysql');
let moment = require('moment');

// const { select } = require('../db/redis');

const addpost = async (userid, username, prodname, cloudfilename, filepath, text, type, isDraft) => {
    text = escape(text);
    username = escape(username);
    prodname = escape(prodname);
    filepath = escape(filepath);
    cloudfilename = escape(cloudfilename);
    type = escape(type);
    let date = moment(new Date()).format('YYYY-MM-DD HH:mm');
    date = escape(date);
    isDraft = isDraft ? 1 : 0;
    const sql = `insert into user_pro(id,username,prodname,cloudfilename,prodpath,text,date,type,isDraft) values(${userid}, ${username},${prodname},${cloudfilename},${filepath},${text},${date},${type},${isDraft})`;
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

// 点赞  或者 收藏 作品
const collectOrStar = async (userid, id, isCollect) => {
    if (isCollect) {
        // 收藏
        const isCollected = `select * from collection where id = ${userid} and  prodid = ${id} and type = 1 `;
        let check = await exec(isCollected);
        if (!check.length) {
            const addCollection = `insert into collection(id,prodid,type) values(${userid},${id},1);`;
            return exec(addCollection);
        } else {
            return Promise.resolve({
                err: -1,
            });
        }
    } else {
        // 点赞
        let star = `select * from stars where userID = ${userid} and targetID = ${id} and isMv = 1 `;
        star = await exec(star);
        if (!star.length) {
            star = `insert into stars(userID,targetID,isMv) values(${userid},${id},1);`;
            return exec(star);
        } else {
            return Promise.resolve({
                err: -1,
            });
        }
    }
};

const getCollectedList = async (userid) => {
    let mv = `
    select  DISTINCT
        * 
        from  
        user_pro 

        LEFT JOIN (
            SELECT COUNT(targetID) starnum  , targetID
            FROM stars
            GROUP BY (targetID)
            )  T1 
            ON T1.targetID = user_pro.prodid


        where user_pro.prodid = any (
            select prodid 
             from collection 
             where id = ${userid}  and type= 1  
        )  `;
    let disscuss = `
        select  DISTINCT
        discuss.* 
        from  
        user_pro ,collection ,user,discuss
        where discuss.discussid = any (
            select 
            prodid 
            from collection 
            where id = ${userid}  and type= 0
        )  `;
    mv = await exec(mv);
    disscuss = await exec(disscuss);

    return Promise.resolve({
        mv,
        disscuss,
    });
};

const getPostlist = async (page, user = 0) => {
    let sql;
    if (user != 0) {
        sql = `
        select  DISTINCT
        *
        from  
        user_pro 


        LEFT JOIN (
            SELECT COUNT(targetID) starnum  , targetID
            FROM stars
            GROUP BY (targetID)
            )  T1 
            ON T1.targetID = user_pro.prodid


        where user_pro.id =(
            select id  from users where id = ${user}
        )   and user_pro.isDraft = 0
        order  by   date   desc   limit   0,${page} ; `;
    } else {
        sql = `select   DISTINCT
        user_pro.* , user.username  ,T1.starnum
        from 
        user,     user_pro  
        
        LEFT JOIN (
            SELECT COUNT(targetID) starnum  , targetID
            FROM stars
            GROUP BY (targetID)
            )  T1 
            ON T1.targetID = user_pro.prodid

        where
        user_pro.id =user.id  and user_pro.isDraft = 0
        order   by 
        date   desc  
        limit   0,${page} ; `;
    }
    return exec(sql).then((e) => {
        return e;
    });
};

// 关键词模糊查询
const getMVlistByKeyWord = async (word) => {
    // word = escape(word);
    let sql = `
        select  DISTINCT
        *
        from  
        user_pro 
        where prodname LIKE '%${word}%' OR text LIKE '%${word}%';
        ; `;

    return exec(sql).then((e) => {
        return e;
    });
};

// 分类查询视频

const getMvListGroupByType = async (type) => {
    type = escape(type);

    let sql = `
    select  
    *
    from
    user_pro 
		LEFT JOIN (
		SELECT COUNT(targetID) starnum  , targetID
		FROM stars
		GROUP BY (targetID)
        )  T1 
        ON T1.targetID = user_pro.prodid
    where  type =${type} `;

    let scroe = `
    SELECT * FROM((SELECT 
        * 
        from
        user_pro) T0
        RIGHT  JOIN (
        select count(targetID) as num , targetID  
        from  stars 
        WHERE isMv = 1
   group by targetID
       ORDER BY num desc
       ) t1 
       on T0.prodid = t1.targetID) 
       WHERE T0.type = ${type}
       

   `;

    scroe = await exec(scroe);
    mv = await exec(sql);
    return Promise.resolve({
        scroe,
        mv,
    });
};

const getUserDrMvList = async (page, user = 0) => {
    let sql = `
        select  DISTINCT
        *
        from  
        user_pro 
        where user_pro.id =(
            select id  from users where id = ${user}
        )   and user_pro.isDraft = 1
        order  by   date   desc   limit   0,${page} ; `;

    return exec(sql).then((e) => {
        return e;
    });
};

const publishDaMvById = async (id) => {
    let sql = `
    UPDATE user_pro 
    SET 
    isDraft = 0
    WHERE prodid=${id};`;
    return exec(sql);
};

module.exports = {
    getUserPostListById,
    collectOrStar,
    getCollectedList,
    getPostlist,
    addpost,
    getProdCloudName,
    deleteProMv,
    getUserDrMvList,
    getMVlistByKeyWord,
    getMvListGroupByType,
    publishDaMvById,
};

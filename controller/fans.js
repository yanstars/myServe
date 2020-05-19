const { exec, escape } = require('../db/mysql');

// 获取 粉丝列表
const getFanslist = async (id) => {
    console.log('id', id);
    const sql = `select  distinct
    user.username,user.id,user.headImgPath
    from user,fans
    where user.id = any ( select fansid  from  fans where  userid =${id}  ) 
    `;

    return exec(sql);
};

// 获取 关注列表

const getMyFoucslist = async (id) => {
    console.log('id', id);
    const sql = `select  distinct
    user.username,user.id,user.headImgPath
    from user,fans
    where user.id = any ( select userid   from  fans where   fansid  =${id}  ) 
    `;

    return exec(sql);
};

//  取消关注
const  disFollow = async (id)=>{


}


module.exports = {
    getFanslist,
    getMyFoucslist,
    disFollow
};

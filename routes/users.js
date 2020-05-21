var express = require('express');
var router = express.Router();
const Cache = require('../db/redis');
const loginCheck = require('../middleware/loginCheck');
let _ = require('lodash');
const { login, addFans, addpost, getUserIdByName, getUserInfoById, signin, isCheckin, getlist, updateUserInfo } = require('../controller/user');
const { getUserPostListById, getCollectedList, collectProductById } = require('../controller/post');
const { getFanslist, getMyFoucslist } = require('../controller/fans');

// const { SuccessModel, ErrorModel } = require('../model');

// 注册

router.post('/signin', async (req, res, next) => {
    const { username, password, tele } = req.body;
    const isSigned = await isCheckin(tele);
    if (isSigned.length) {
        res.json({
            code: 4000,
            message: '该手机号已被注册',
        });
    } else {
        let result = await signin(username, password, tele);
        if (!result.warningCount) {
            res.json({
                code: 6000,
                message: '注册成功',
            });
        } else {
            res.json({
                code: 4000,
                message: '注册失败',
            });
        }
    }
});

// 登录
router.post('/login', async (req, res, next) => {
    const { tele, password } = req.body;
    let { id } = await login(tele, password);
    // id: '0000000000000030',
    // password: '123456789',
    // tele: '18382370489'
    if (id) {
        let key = tele + '9527';
        Cache.set(key, id);
        Cache.expire(key, 60 * 60);
        res.cookie('user', key, {});

        // 获取用户基本信息
        let userinfo = await getUserInfoById(id);
        res.json({
            code: 5000,
            msg: '登陆成功',
            userinfo,
        });
    } else {
        res.json({
            code: 4000,
            msg: '登陆失败',
        });
    }
});

// 退出登录
router.post('/exit', loginCheck, async (req, res, next) => {
    if (req.cookies.user) {
        res.clearCookie('user');
        res.json({
            msg: '退出成功',
            code: 6666,
        });
    } else {
        res.json({
            msg: '出错了',
            code: 4444,
        });
    }
});

//  个人设置界面  修改并保存用户的个人信息
router.post('/saveUserInfo', loginCheck, async (req, res) => {
    let userid = req.userid;
    let { birth, info, sex, username } = req.body;
    let { warningCount } = await updateUserInfo(userid, birth, info, sex, username);
    if (!warningCount) {
        res.json({
            code: 6666,
            msg: '更新成功',
        });
    } else {
        res.json({
            code: 4444,
            msg: '更新失败',
        });
    }
});

// // 获取用户信息
// router.get('/getUserInfo/:id', async (req, res) => {
//     let userid = req.params.id;
//     let userinfo = await getUserInfoById(userid);
//     res.json({
//         userinfo,
//     });
// });

// 修改头像

//  用户  id  查询用户的详细信息 和 作品列表
router.get('/getUserInfoById/:id', async (req, res) => {
    let userid = req.params.id;
    console.log('userid :>> ', userid);
    let result = await getUserInfoById(userid);
    console.log('result :>> ', result);
    let list = await getUserPostListById(userid);
    res.json({
        code: 6666,
        msg: '操作成功',
        data: result,
        list: list,
    });
});

//  根据 productId  收藏 帖子
router.post('/collectPost', loginCheck, async (req, res) => {
    let user;
    if (req.cookies.user) {
        user = req.cookies.user;
    }
    let { productId } = req.body;
    let userid = await getUserIdByName(user);
    userid = userid[0].id;
    let aa = await collectProductById(userid, productId);
    if (aa.err && aa.err == -1) {
        res.json({
            msg: '已经收藏了',
            code: 4444,
        });
    }
    if (aa.warningCount == 0) {
        res.json({
            code: 6666,
            mdg: '收藏成功',
        });
    } else {
        res.json({
            code: 4444,
            msg: '出错了',
        });
    }
});

// getUserInfoByName

// router.get('/getUserInfo', async (req, res, next) => {
//     let tele = req.cookies.user;
//     let result = await getUserInfo(tele);
//     res.json(result[0]);
// });

//  获取收藏列表
router.get('/getCollectionList', async (req, res, next) => {
    let name = req.cookies.user;
    let userid = await getUserIdByName(name);
    userid = userid[0].id;
    let result = await getCollectedList(userid);
    res.json(result);
});

//获取 fans 列表
router.get('/fetFansList', async (req, res, next) => {
    let name = req.cookies.user;
    let userid = await getUserIdByName(name);
    userid = userid[0].id;
    let myfans = await getFanslist(userid);
    let myfoucs = await getMyFoucslist(userid);
    let result = {
        myfans,
        myfoucs,
    };

    res.json(result);
});

// 关注
router.post('/follow', async (req, res, next) => {
    let name = req.cookies.user;
    let id = await getUserIdByName(name);
    id = id[0].id;
    let { targetid } = req.body;
    let result = await addFans(id, targetid);
    if (!result.warningCount) {
        res.json({
            code: 6666,
            msg: '关注成功',
        });
    } else {
        res.json({
            code: 4444,
            msg: '出错了',
        });
    }
});

router.get('/mv.mp4', async (req, res, next) => {
    let result = await client.get('/mv/mv.mp4');
    res.end(result.content);
});

// router.get('/login-test', (req, res, next) => {
//     if (req.session.username) {
//         res.json({
//             errno: 0,
//             msg: '已登录'
//         })
//         return
//     }
//     res.json({
//         errno: -1,
//         msg: '未登录'
//     })
// })

// router.get('/session-test', (req, res, next) => {
//     const session = req.session
//     if (session.viewNum == null) {
//         session.viewNum = 0
//     }
//     session.viewNum++

//     res.json({
//         viewNum: session.viewNum
//     })
// })

module.exports = router;

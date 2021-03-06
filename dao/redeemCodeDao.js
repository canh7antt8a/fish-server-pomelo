/*!
 * Copyright(c) 2014 jason.bin <23692515@qq.com>
 * 关于用户数据redis 操作
 * 数据库交互的数据在本文件完成，数据库中数据格式不要传到外层
 * 数据库需要序列列在此处处理
 * 逻辑层交互最小单位是obj
 */
var redisCmd = require("./redis/redisCmd");
var CONST = require('../common/consts');//redeemCode
var DBKEY = "fish4RedeemCode:";

//本文件导出
var RedeemCodeDao = module.exports;
/**
 * 已经存在用户写档,key values 对应
 * h_user 写档
 */
RedeemCodeDao.write = function (user,cb){
    //初始化设置玩家信息保存到数据库
    var mng = user.contMng;
    var guid = user.getUid();
    var writeData = mng.codes.writeDataToDbByUid();
    console.log("-------------------101writeData",writeData);
    redisCmd.hmset(
        DBKEY + guid,
        writeData,
        function (err, reply) {
            cb(err, reply);
        });
};

/**
 *读档, 读档成功后生item对象
 */
RedeemCodeDao.load = function (user, cb){
    var uid    = user.getUid();
    var cmd     = DBKEY + uid;
    redisCmd.hgetall(cmd, function (err, reply) {
        if (err) {
            cb(err, null);
            return;
        }
        if (!reply) {
            //这种情况是数据中没有该user,可能是个新用户
            cb(err,  null);
            return;
        }
        user.contMng.codes.fromDb(reply);
        cb(null, {});
    });
}

/**
 *删除指定OBJ  不确定是否用到，，暂且先注释掉 xiahou 2017/2/10
 */
/*RedeemCodeDao.delete = function (id, cb){

    redisCmd.hdel(DBKEY,id, function (err, reply) {
        cb(err, reply);
    });
}*/

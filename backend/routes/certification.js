var express = require('express');
var router = express.Router();
var models = require("../models/index");
var jwt = require('jsonwebtoken');
var secretObj = require('../config/jwt');
var key = require("../config/cry");
var sequelize = require('sequelize')
const crypto = require('crypto');

var failedResultCode = 400;
var successResultCode = 200;

const Op = sequelize.Op;

var successMessage = encrypt('success');
var failedMessage =  encrypt('failed');
router.post('/sp/login', (req, res, next) => {
    console.log(req.headers);
    const token = jwt.sign({ 
        userid : req.headers.userid //payload(토큰 내용)
     }, secretObj.secret, //비밀키
    { 
        expiresIn: '1m'
    })

    models.admins.findOne({ where: { id_ad : req.headers.userid } }) 
    .then((admin) => {
        admin.update({token_ad : token})
        .then(() => {
            console.log("Admin Success", admin.id_ad);
            res.json({ resultCode : successResultCode, message : successMessage, userName : encrypt(admin.name_ad), token : admin.token_ad})
        })
    }).catch(() => {
        models.branches.findOne({ where: { id_br : req.headers.userid } }) 
        .then((branch) => {
            branch.update({token_br : token})
            .then(() => {
                console.log("Branches Success", branch.id_br);
                res.json({ resultCode : successResultCode, message : successMessage, userName : encrypt(branch.name_br), token : branch.token_br})
            })
        })
        .catch(() => {
            models.teachers.findOne({ where: { id_tc : req.headers.userid } }) 
            .then((teacher) => {
                teacher.update({token_tc : token})
                .then(() => {
                    console.log("teacher Success", teacher.id_tc);
                    res.json({ resultCode : successResultCode, message : successMessage, userName : encrypt(teacher.name_br), token : teacher.token_tc})
                })
            })
            .catch(() => {
                console.log("No teachsers")
                res.json({resultCode : failedResultCode, message : failedMessage})
            })
        })
    })
});
// password, os, ip 들어옴

router.post('/sp/logout', (req,res,next) => {
    models.admins.findOne({ where: { id_ad : req.headers.userid } }) 
    .then((admin) => {
        admin.update({token_ad : ''})
        .then(() => {
            console.log("Admin Success", admin.id_ad);
            res.json({ resultCode : successResultCode, message : successMessage})
        })
    }).catch(() => {
        models.branches.findOne({ where: { id_br : req.headers.userid } }) 
        .then((branch) => {
            branch.update({token_br : ''})
            .then(() => {
                console.log("Branches Success", branch.id_br);
                res.json({ resultCode : successResultCode, message : successMessage})
            })
        })
        .catch(() => {
            models.teachers.findOne({ where: { id_tc : req.headers.userid } }) 
            .then((teacher) => {
                teacher.update({token_tc : ''})
                .then(() => {
                    console.log("teacher Success", teacher.id_tc);
                    res.json({ resultCode : successResultCode, message : successMessage})
                })
            })
            .catch(() => {
                res.json({error : "Not Information userId", resultCode : failedResultCode, message : failedMessage})
            })
        })
    })
  });  
// password, os, ip 들어옴

// -------------------------------------------------------------aos Login
router.post('/aos/login', (req, res, next) => {
    console.log("=========================================Aos Login==============================================")
    console.log(req.headers);
    console.log(req.body);

    const tokenJwt = jwt.sign({ 
        id_ad : req.headers.userid //payload(토큰 내용)
     }, secretObj.secret, //비밀키
    { 
        expiresIn: '1m'  // 유효시간
    })
    var token = encrypt(tokenJwt);
    var resultApplist = [];
    var resultIngangApps = [];
    var resultBrowsers = [];
    var pcInfos = [];
    models.students.findOne({ where : { id_st : req.headers.userid },
    include : [
        {
            model : models.teachers, 
            where : sequelize.where(
            sequelize.col('students.id_tc'),
            sequelize.col('teacher.id_tc'),
        )},
        {
            model : models.branches,
            where : sequelize.where(
            sequelize.col('students.id_br'),
            sequelize.col('branch.id_br'),
        )},
        {
            model : models.stsettings,
            where : sequelize.where(
            sequelize.col('students.id_st'),
            sequelize.col('stsetting.id_st'),
          )
        }
    ]  
    })
    .then((students) => {
            
            console.log('students 존재', students.branch.id_br);
            
            models.stsettings.findOne({where : {id_st : req.headers.userid}})
            .then((stsettings) => {
                stsettings.update({os : req.headers.os, osver : req.headers.osver, ip_st : decrypt(req.body.ip), resolution : decrypt(req.body.resolution), cmdport : req.body.cmdPort, token_st : decrypt(token)})
                .catch((err) => {console.log("stsettings 최신", err.original.detail)})
                models.applist.findAll({where : {b_disabled : false}})
                .then((applist) => {
                    models.applist.findAll({where : {b_ingang : { [Op.or] : [true,false] }}})
                    .then((ingangApps) => {
                        models.applist.findAll({where : {b_browser : { [Op.ne] : null }}})
                        .then((browsers) => {
                    
                        for(var i = 0 ; i < applist.length ; i++){
                            resultApplist.push({
                                idx : applist[i].idx,
                                appId : encrypt(applist[i].id_app),
                                appName : encrypt(applist[i].name_app),
                                bIngang : applist[i].b_ingang,
                                bDisabled : applist[i].b_disabled,
                                bBrowser : applist[i].b_browser
                            })
                        }
                        for(var i = 0 ; i < ingangApps.length ; i++){
                            resultIngangApps.push({
                                idx : ingangApps[i].idx,
                                appId : encrypt(ingangApps[i].id_app),
                                appName : encrypt(ingangApps[i].name_app),
                                bIngang : ingangApps[i].b_ingang,
                                bDisabled : ingangApps[i].b_disabled,
                                bBrowser : ingangApps[i].b_browser
                            })
                        }
                        for(var i = 0 ; i < browsers.length ; i++){
                            resultBrowsers.push({
                                idx : browsers[i].idx,
                                appId : encrypt(browsers[i].id_app),
                                appName : encrypt(browsers[i].name_app),
                                bIngang : browsers[i].b_ingang,
                                bDisabled : browsers[i].b_disabled,
                                bBrowser : browsers[i].b_browser
                            })
                        }
                        pcInfos.push({
                            macAddr : encrypt(students.branch.mac_br),
                            imgUploadURL : encrypt(students.branch.thumburl_br),
                        })
                        pcInfos.push({
                            macAddr : encrypt(students.teacher.mac_tc),
                            imgUploadURL : encrypt(students.teacher.thumburl_tc),
                        })
                        console.log('Response ',pcInfos);
                            res.json({resultCode : successResultCode, message : successMessage, 
                                token : token, userName : encrypt(students.name_st), 
                                pcInfos : pcInfos,
                                settings : { bBlockBrower : students.branch.b_blockbrowser, bBlockOtherApps  : students.branch.b_blockotherapps, 
                                            bBlockRemoveApps : students.branch.b_blockremove,
                                            bBlockForceStop : students.branch.b_blockforcestop, 
                                            colorBit : students.branch.colorbit, imgFps : students.branch.fps, 
                                            bLockscreen : stsettings.b_lockscreen},
                                appList : {allowedApps : resultApplist, ingangApps : resultIngangApps, browsers : resultBrowsers}            
                                            
                            })
                        }).catch((err) => {console.log("browsers Null", err)
                    })
                    }).catch((err) => {console.log("ingangApps Null")})
                }).catch((err) => {console.log("allowedApps Null")})
            })
        
    }).catch(() => {
        console.log("Students Teachers branches 존재 X")            // Android Login before made Pc Info
        models.stsettings.create({id_st : req.headers.userid, os : req.headers.os, osver : req.headers.osver, ip_st : decrypt(req.body.ip), resolution : decrypt(req.body.resolution), cmdport : req.body.cmdPort, token_st : decrypt(token)})
        .then(() => {console.log("stsettings 생성")})
        .catch(() => {
            models.stsettings.update({os : req.headers.os, osver : req.headers.osver, ip_st : decrypt(req.body.ip), resolution : decrypt(req.body.resolution), cmdport : req.body.cmdPort, token_st : decrypt(token)},
            {
            where : {id_st : req.headers.userid}
            }).then(() => {console.log("stsettings Update!")}).catch((err) => {console.log("stsettings 최신", err.original.detail)})})

            models.applist.findAll({where : {b_disabled : false}})
            .then((applist) => {
                models.applist.findAll({where : {b_ingang : {[Op.ne] : null}}})
                .then((ingangApps) => {
                    models.applist.findAll({where : {b_browser : {[Op.ne] : null}}})
                    .then((browsers) => {
                    for(var i = 0 ; i < applist.length ; i++){
                        resultApplist.push({
                            idx : applist[i].idx,
                            appId : encrypt(applist[i].id_app),
                            appName : encrypt(applist[i].name_app),
                            bIngang : applist[i].b_ingang,
                            bDisabled : applist[i].b_disabled,
                            bBrowser : applist[i].b_browser
                        })
                    }
                    for(var i = 0 ; i < ingangApps.length ; i++){
                        resultIngangApps.push({
                            idx : ingangApps[i].idx,
                            appId : encrypt(ingangApps[i].id_app),
                            appName : encrypt(ingangApps[i].name_app),
                            bIngang : ingangApps[i].b_ingang,
                            bDisabled : ingangApps[i].b_disabled,
                            bBrowser : ingangApps[i].b_browser
                        })
                    }
                    for(var i = 0 ; i < browsers.length ; i++){
                        resultBrowsers.push({
                            idx : browsers[i].idx,
                            appId : encrypt(browsers[i].id_app),
                            appName : encrypt(browsers[i].name_app),
                            bIngang : browsers[i].b_ingang,
                            bDisabled : browsers[i].b_disabled,
                            bBrowser : browsers[i].b_browser
                        })
                    }
                    pcInfos.push({
                        macAddr : null,
                        imgUploadURL : null,
                    })
                    pcInfos.push({
                        macAddr : null,
                        imgUploadURL : null,
                    })
                    res.json({resultCode : successResultCode, message : successMessage, 
                        token : token, userName : null, pcInfos : pcInfos, 
                        settings : {bBlockBrower : null, bBlockOtherApps  : null, 
                            bBlockRemoveApps : null,
                            bBlockForceStop : null, 
                            colorBit : null, imgFps : null, 
                            bLockscreen : null},
                        appList : {allowedApps : resultApplist, ingangApps : resultIngangApps, browsers : resultBrowsers}
                        })
                    }).catch((err) => {console.log("browsers Null", err.original.detail)})
                }).catch((err) => {console.log("ingangApps Null", err.original.detail)})
            }).catch((err) => {console.log("allowedApps Null", err.original.detail)})
    })
})
// -------------------------------------------------------------aos Logout
router.post('/aos/logout', (req, res, next) => {

    console.log("=========================================Aos Logout==============================================")
    models.stsettings.findOne({where : {token_st : req.headers.token}})
    .then(() => {
        res.json({resultCode : successResultCode, message : successMessage})
    })
    .catch(() => {
        res.json({ resultCode : failedResultCode, message : failedMessage })
    })
})
// -------------------------------------------------------------aos savelog

router.post('/aos/savelog', (req, res, next) => {
    console.log("=========================================Aos SaveLog==============================================")
    console.log("Header : ", req.headers);
    console.log("Body : ", req.body);
    models.stsettings.findOne({ where : { id_st : req.headers.userid }})
        .then((stsettings) => {
            console.log(stsettings);
            if(stsettings !== null) {
                console.log('step1');
                models.stsettings.create({id_st : req.headers.userid, os : req.headers.os})
                .then(() => {
                    console.log("stsetting : success");
                }).catch(() => {
                    models.stsettings.update({id_st : req.headers.userid, os : req.headers.os},{ where : {id_st : req.headers.userid}})
                    console.log("이미 존재");
                })
                models.stlogs.create({id_st : req.headers.userid, logtype : req.body.logType, id_app : decrypt(req.body.appId), name_app : decrypt(req.body.appName), starttime : decrypt(req.body.startTime), endtime : decrypt(req.body.endTime), logmsg : decrypt(req.body.message)})
                .then(() => {
                    console.log("stlogs : success");
                })
                .catch((err) => {
                    console.log("이미 존재 stlogs", err);
                })

                models.applist.findOne({ where : {id_app : decrypt(req.body.appId)}})
                .then(() => {
                    console.log("applist 존재");
                })
                .catch(() => [
                    models.applist.create({id_app : decrypt(req.body.appId), name_app : decrypt(req.body.appName)})
                    .then(() => {
                        console.log("applist : success");
                    })
                    .catch(() => {
                        console.log("applist create : error");
                    })
                ])
                res.json({resultCode : successResultCode, message : successMessage})
            }
            else {
                console.log("stsettings null")
               res.json({ resultCode : failedResultCode, message : failedMessage })
            }
        })
        .catch(() => {
            console.log("students error")
        })
})

module.exports = router;

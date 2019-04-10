var express = require('express');
var router = express.Router();
var models = require("../models/index");
var jwt = require('jsonwebtoken');
var secretObj = require('../config/jwt');
var sequelize = require('sequelize')

var failedMessage = 'failed';
var failedResultCode = 400;
var successMessage = 'success';
var successResultCode = 200;
var checkAuthor;

router.post('/sp/login', function(req, res, next) {
    
    const token = jwt.sign({ 
        id_ad : req.body.id_ad //payload(토큰 내용)
     }, secretObj.secret, //비밀키
    { 
        expiresIn: '1m'  // 유효시간
    })

    models.admins.findOne({ where: { id_ad : req.body.id_ad } }) 
    .then((admin) => {
            console.log('Admin : ');
            admin.update({token_ad : token}, {httpOnly: true})
            res.json({ resultCode : successResultCode, message : successMessage, userName : admin.name_ad})
            checkAuthor=admin.token_ad;
    })

    models.branches.findOne({ where: { id_br : req.body.id_ad } }) 
    .then((branch) => {
            console.log('branch : ');
            branch.update({token_br : token}, {httpOnly: true})
            res.json({ resultCode : successResultCode, message : successMessage, userName : branch.name_br})
            checkAuthor=branch.token_br;
    })
        
    models.teachers.findOne({ where: { id_tc : req.body.id_ad } }) 
    .then((teacher) => {
            console.log('teacher : ');
            teacher.update({token_tc : token}, {httpOnly: true})
            res.json({ resultCode : successResultCode, message : successMessage, userName : teacher.name_tc})
            checkAuthor=teacher.token_tc;
            
        }).catch((err) => {
        res.json({ resultCode : failedResultCode, message : failedMessage})
    })  
    setTimeout(() =>{
        console.log(checkAuthor)}, 3000);
});
// password, os, ip 들어옴

router.post('/sp/logout', (req,res,next) => {

    if(req.body.author === 'admin') {
        models.admins.update({ token_ad : '' }, {where : { token_ad : {ne : null}}})
      .then(() => {
        res.json({resultCode : successResultCode, message : successMessage});
        })
    } else if(req.body.author.includes('branches')) {
        models.branches.update({ token_br : '' },{where : { token_br : {ne : null}}})
        .then(() => {
        res.json({resultCode : successResultCode, message : successMessage});
        })
    } else if(req.body.author.includes('teachers')) {
        models.teachers.update({ token_tc : '' }, {where : { token_tc : {ne : null}}})
        .then(() => {
        res.json({resultCode : successResultCode, message : successMessage});
        })
    } else {
        res.json({resultCode : failedResultCode, message : failedMessage});
    }
  });  
// password, os, ip 들어옴

router.get('/sp/check', (req,res,next) => {
    let success = 'success!!';

        models.admins.findOne({ where: { token_ad : checkAuthor}}) 
        .then((admin) => {
            console.log('Admin Exist');
            res.json({ resultCode : successResultCode, message : successMessage, confirm : success, userName : admin.name_ad})
        })
    

        models.branches.findOne({ where: { token_br : checkAuthor}}) 
        .then((branch) => {
            console.log('branch Exist');
            res.json({ resultCode : successResultCode, message : successMessage, confirm : success, userName : branch.name_br})
        })

        models.teachers.findOne({ where: { token_tc : checkAuthor}}) 
        .then((teacher) => {
            console.log('teacher Exist');
            res.json({ resultCode : successResultCode, message : successMessage, confirm : success, userName : teacher.name_tc})
        }).catch(() => {
            res.json({ resultCode : failedResultCode, message : failedMessage })
        })
});

// -------------------------------------------------------------aos Login
router.post('/aos/login', (req, res, next) => {
    const token = jwt.sign({ 
        id_ad : req.headers.userid //payload(토큰 내용)
     }, secretObj.secret, //비밀키
    { 
        expiresIn: '1m'  // 유효시간
    })
    console.log(req.headers.userid);
    models.students.find({ where : { id_st : req.headers.userid },
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
            sequelize.col('stsettings.id_st'),
          )
        }
    ]  
    })
    .then((students) => {
        console.log('여기요', students);
        students.update({token_st : token}, {httpOnly: true})
        models.applist.findAll({where : {b_disabled : false}})
        
        .then((applist) => {
            models.applist.findAll({where : {b_ingang : {ne : null}}})
            .then((ingangApps) => {
                console.log(ingangApps);
                models.applist.findAll({where : {b_browser : {ne : null}}})
                .then((browers) => {
                    console.log(browers,'HGer');
                    res.json({resultCode : successResultCode, message : successMessage, 
                        token : token, userName : students.id_st, 
                        mgrUploadURL : students.branch.thumburl_br, tcrUploadURL : students.teacher.thumburl_tc,
                        settings : { bBlockBrower : students.branch.b_blockbrowser, bBlockOtherApps  : students.branch.b_blockotherapps, 
                                     bBlockRemoveApps : students.branch.b_blockremove,
                                     bBlockForceStop : students.branch.b_blockforcestop, 
                                     colorBit : students.branch.colorbit, imgFps : students.branch.fps, 
                                     bLockscreen : students.stsettings.b_lockscreen},
                        appList : applist, ingangApps : ingangApps, browers : browers            
                                    
                     })
                })
                
            })
            
        })
    })
    .catch(err => {
        res.json({token : token ,resultCode : failedResultCode, message : failedMessage })
      });
})
// -------------------------------------------------------------aos Logout
router.post('/aos/logout', (req, res, next) => {
    models.students.findOne({where : {token_st : req.headers.token}})
    .then(students => {
        students.update({token_st : ''}, {httpOnly: true})
        res.json({resultCode : successResultCode, message : successMessage})
    })
    .catch(() => {
        res.json({ resultCode : failedResultCode, message : failedMessage })
    })
})
// -------------------------------------------------------------aos savelog

router.post('/aos/savelog', (req, res, next) => {
    models.students.findOne({ where : { id_st : req.headers.userid }})
        .then((savelog) => {
            models.stsettings.create({id_st : req.headers.userid, os : req.headers.os})
            .then(() => {
                console.log("stsetting : success");
            }).catch(() => {
                console.log("이미 존재");
            })
            models.stlogs.create({id_st : req.headers.userid, logtype : req.body.logType, id_app : req.body.appId, name_app : req.body.appName, starttime : req.body.startTime, endtime : req.body.endTime, logmsg : req.body.message})
            .then(() => {
                console.log("stlogs : success");
            })
            .catch((err) => {
                console.log("이미 존재 stlogs", err);
            })
            res.json({resultCode : successResultCode, message : successMessage})
        })
        .catch(() => {
            res.json({ resultCode : failedResultCode, message : failedMessage })
        })
})

// --------------------------------------------------------------Teacher pc login
router.post('/pc/login', (req, res, next) => {



    const token = jwt.sign({ 
        id_ad : req.body.id_ad //payload(토큰 내용)
     }, secretObj.secret, //비밀키
    { 
        expiresIn: '1m'  // 유효시간
    })

    if(req.headers.usertype !== "M"){
        models.teachers.findOne({where : {id_tc : req.headers.userid}
        })
        .then((teachers) => {
            teachers.update({ip_tc : req.body.ip, thumburl_tc : req.body.upLoadUrl, id_tc : req.body.members[0].brInfos[0].tcId, name_tc : req.body.members[0].brInfos[0].tcName, token_tc : token});

            models.branches.findOne({where : {id_br : teachers.id_br}})
            .then((branches) => {

                branches.update({id_br : req.body.members[0].brId, name_br : req.body.members[0].brName})
               
                models.students.findAll({where : {id_tc : teachers.id_tc}})
                .then((students) => {
                    var dbArray = [];
                    var dbNameArray = [];
                    var queryArray = [];
                    var queryNameArray = [];
                    var deleteArray = [];
                    var insertArray = [];
                    var insertNameArray = [];

                    //DB > Query Delete!    
                    if(students.length > req.body.members[0].brInfos[0].stInfos.length){
                        console.log("Delete Fc")
                        for(var i = 0 ; i < students.length; i++){
                            dbArray.push(students[i].id_st);
                        }
                        for(var i = 0 ; i < req.body.members[0].brInfos[0].stInfos.length; i++){
                            queryArray.push(req.body.members[0].brInfos[0].stInfos[i].stId);
                        }
                        deleteArray = dbArray.filter((a) => !queryArray.includes(a));

                        for(var i = 0 ; i < deleteArray.length ; i++){
                            models.students.destroy(
                                {
                                  where : { id_st : deleteArray[i]}
                                })
                              .then(() => {
                                console.log("삭제 성공");
                                for(var i = 0 ; i < req.body.members[0].brInfos[0].stInfos.length ; i++) {
                                    models.students.update({
                                        id_st : req.body.members[0].brInfos[0].stInfos[i].stId,
                                        name_st : req.body.members[0].brInfos[0].stInfos[i].stName
                                    },
                                       {
                                           where : {id_st : req.body.members[0].brInfos[0].stInfos[i].stId
                                        }}).then(() => {
                                            res.json({resultCode : successResultCode, message : successMessage, token : token})
                                        }).catch(() => {
                                            res.json({resultCode : failedResultCode, message : failedMessage})
                                        })
                                }
                              })
                              .catch(() => {
                                console.log("삭제 실패");
                              })
                        }
                    }
                    //DB < Query Insert!
                    else if(students.length < req.body.members[0].brInfos[0].stInfos.length){
                        console.log("Insert Fc")
                        for(var i = 0 ; i < students.length; i++){
                            dbArray.push(students[i].id_st);
                            dbNameArray.push(students[i].name_st)
                            // students.update({id_st : req.body.members[0].brInfos[0].stInfos[i].stId, name_st : req.body.members[0].brInfos[0].stInfos[i].stName})
                        }
                        for(var i = 0 ; i < req.body.members[0].brInfos[0].stInfos.length; i++){
                            queryArray.push(req.body.members[0].brInfos[0].stInfos[i].stId);
                            queryNameArray.push(req.body.members[0].brInfos[0].stInfos[i].stName);
                        }
                        insertArray = queryArray.filter((a) => !dbArray.includes(a));
                        insertNameArray = queryNameArray.filter((a) => !dbNameArray.includes(a));
                        console.log("insertArray : ", insertArray, insertArray.length, insertNameArray);

                        for(var i = 0 ; i < insertArray.length ; i++){
                            models.students.create({id_st : insertArray[i], name_st : insertNameArray[i], id_tc : req.headers.userid, id_br : req.body.members[0].brId})
                              .then(() => {
                                console.log("삽입 성공");
                                for(var i = 0 ; i < req.body.members[0].brInfos[0].stInfos.length ; i++) {
                                    models.students.update({
                                        id_st : req.body.members[0].brInfos[0].stInfos[i].stId,
                                        name_st : req.body.members[0].brInfos[0].stInfos[i].stName
                                    },
                                       {
                                           where : {id_st : req.body.members[0].brInfos[0].stInfos[i].stId
                                        }}).then(() => {
                                            
                                        })
                                }
                              })
                              .catch(() => {
                                console.log("삽입 실패");
                              })
                        }
                    }
                    else {
                        console.log("SameThing Fc")
                        for(var i = 0 ; i < req.body.members[0].brInfos[0].stInfos.length ; i++) {
                            models.students.update({
                                id_st : req.body.members[0].brInfos[0].stInfos[i].stId,
                                name_st : req.body.members[0].brInfos[0].stInfos[i].stName
                            },
                               {
                                   where : {id_st : req.body.members[0].brInfos[0].stInfos[i].stId
                                }}).then(() => {
                                    res.json({resultCode : successResultCode, message : successMessage, token : token})
                                }).catch(() => {
                                    res.json({resultCode : failedResultCode, message : failedMessage})
                                })
                        }
                    }
                })
            })
               
        })
        .catch(() => {
            console.log("teachers failed");
        })
    }
    
// ------------------------------------------------------------------------branch PC login
    else {
        models.branches.findOne({where : {id_br : req.headers.userid}})
        .then((branches) => {
            
        })
        .catch(() => {
            console.log("branches failed");
        })
    }
    


    
})
module.exports = router;

/*
							{"stId": "11:3a:9e:50:8f:e9","stName": "티쳐3"},
							{"stId": "33:79:a8:25:8a:61","stName": "티쳐2"},
							{"stId": "22:b7:98:4d:53:d0" ,"stName": "티쳐1"}
*/
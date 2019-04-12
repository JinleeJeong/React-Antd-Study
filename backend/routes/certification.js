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
            sequelize.col('stsettings.id_st'),
          )
        }
    ]  
    })
    .then((students) => {
        console.log('여기요', students);
        students.update({token_st : token}, {httpOnly: true})
        models.stsettings.findOne({where : {id_st : req.headers.userid}})
        .then((stsettings) => {
            stsettings.update({os : req.headers.os, osver : req.headers.osver, ip_st : req.body.ip, resolution : req.body.resolution})
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
                            mgrUploadURL : branches.thumburl_br, tcrUploadURL : students.teacher.thumburl_tc,
                            settings : { bBlockBrower : branches.b_blockbrowser, bBlockOtherApps  : branches.b_blockotherapps, 
                                        bBlockRemoveApps : branches.b_blockremove,
                                        bBlockForceStop : branches.b_blockforcestop, 
                                        colorBit : branches.colorbit, imgFps : branches.fps, 
                                        bLockscreen : students.stsettings.b_lockscreen},
                            appList : applist, ingangApps : ingangApps, browers : browers            
                                        
                        })
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
        .then(() => {
            models.stsettings.create({id_st : req.headers.userid, os : req.headers.os})
            .then(() => {
                console.log("stsetting : success");
            }).catch(() => {
                models.stsettingsUpdate.update({id_st : req.headers.userid, os : req.headers.os})
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

    // 브랜치 로그인

    if(req.headers.usertype === "M"){
        models.branches.findOne({where : { id_br : req.headers.userid }}) // 브랜치 찾기 & 업데이트
        .then((branches) => {
            branches.update({ip_br : req.body.ip, thumburl_br : req.body.upLoadUrl, id_br : req.headers.userid, name_br : req.body.members[0].brName, token_br : token, os_br : req.headers.os})
            .catch(()=>{res.json({ resultCode : failedResultCode, message : failedMessage })})

            models.students.destroy({where: { id_br : req.headers.userid}})
            .then(() => 
            {
                console.log("학생 삭제");
                models.teachers.destroy({where : {id_br : req.headers.userid}})
                .then(() => 
                {
                    console.log("선생 삭제");
                    for(let i = 0 ; i < req.body.members[0].brInfos.length; i++){
                        models.teachers.create({id_tc : req.body.members[0].brInfos[i].tcId, name_tc : req.body.members[0].brInfos[i].tcName, id_br : req.body.members[0].brId})
                        .then(() => {
                            console.log("선생 생성");
                            models.tcsettings.create({id_tc : req.body.members[0].brInfos[i].tcId})
                            .then(() => {console.log("tcsetting Success")}).catch(() => {console.log("tcsetting 최신")})

                            for(let j = 0 ; j < req.body.members[0].brInfos[i].stInfos.length; j++){
                                models.students.create({id_st : req.body.members[0].brInfos[i].stInfos[j].stId, name_st : req.body.members[0].brInfos[i].stInfos[j].stName, id_tc : req.body.members[0].brInfos[i].tcId, id_br : req.headers.userid})
                                .then(() => {
                                    console.log("학생 생성");
                                    models.stsettings.create({id_st : req.body.members[0].brInfos[i].stInfos[j].stId})
                                    .then(() => {console.log("stsettings Success");}).catch(() => {console.log("stsettings 최신")})
                                }).catch(()=>{res.json({ resultCode : failedResultCode, message : failedMessage })})
                            }
                            
                        }).catch(()=>{res.json({ resultCode : failedResultCode, message : failedMessage })})
            }

        }).then(() => {
            models.stsettings.findAll({attributes : [`id_st`, `ip_st`, `no_st`, `b_lockscreen`]}).then((stsettings) => {

                console.log('stsetting ', stsettings);
                var resultResponse = {
                    resultCode : successResultCode, message : successMessage, token : token, 
                    settings : { bBlockBrower : branches.b_blockbrowser, bBlockOtherApps  : branches.b_blockotherapps, 
                    bBlockRemoveApps : branches.b_blockremove,
                    bBlockForceStop : branches.b_blockforcestop, 
                    colorBit : branches.colorbit, imgFps : branches.fps, 
                    }, stInfo : stsettings
                }
                res.json(resultResponse);
            }).catch(()=>{res.json({ resultCode : failedResultCode, message : failedMessage })})
        }).catch(()=>{res.json({ resultCode : failedResultCode, message : failedMessage })})
    }).catch(()=>{res.json({ resultCode : failedResultCode, message : failedMessage })})

        }).catch(() => { // branches 존재하지 않음
            models.branches.create({ip_br : req.body.ip, thumburl_br : req.body.upLoadUrl, id_br : req.headers.userid, name_br : req.body.members[0].brName, token_br : token, os_br : req.headers.os})
            
            var alreadyTeachers = [];
            var alreadyTeachersName = [];
            var newTeachers = [];
            var newTeachersName = [];
            var updateTeachers = [];
            var insertTeachers = [];

            models.teachers.findAll() 
            .then((teachersAll) => {
                console.log("success");
                for(var i = 0; i < teachersAll.length ; i++){ // 전체 선생
                    alreadyTeachers.push(teachersAll[i].id_tc);
                    alreadyTeachersName.push(teachersAll[i].name_tc);
                }
                for(var j = 0; j < req.body.members[0].brInfos.length; j++){ // 입력 선생
                    newTeachers.push(req.body.members[0].brInfos[j].tcId);
                    newTeachersName.push(req.body.members[0].brInfos[j].tcName);
                }
                console.log(alreadyTeachers, alreadyTeachersName)
                console.log(newTeachers, newTeachersName);
                var newTeachersString
                updateTeachers = alreadyTeachers.filter((a) => newTeachers.includes(a));
                console.log("update : ", updateTeachers); // 업데이트 선생 ID
                insertTeachers = newTeachers.filter((a) => !alreadyTeachers.includes(a));
                console.log("insertTeachers : ", insertTeachers); // Insert 선생 ID
                for(var z = 0 ; z < newTeachers.length ; z++){
                    newTeachersString = newTeachers[z]
                    console.log(newTeachersString)
                    if(alreadyTeachers.indexOf(newTeachersString) !== -1){
                        console.log("Teachers update!!", z);
                        models.teachers.update(
                            {
                                id_tc : newTeachers[z], name_tc : newTeachersName[z]
                            }, 
                            {
                                where : {id_tc : newTeachers[z]}
                            }).then(() => {console.log("업데이트")})
                            .catch(() => {console.log("업데이트없음")})
                    }
                    else {
                        console.log("Teachers Insert!!", z);
                        models.teachers.create({id_tc : newTeachers[z], name_tc :newTeachersName[z], id_br : req.body.members[0].brId})
                    }
                }
                for(var i = 0 ; i < insertTeachers.length ; i++){
                    models.tcsettings.create({id_tc : insertTeachers[i]})
                    .then(() => {console.log("tcsetting Success")}).catch(() => {console.log("tcsetting 최신")})
                    for(let j = 0 ; j < req.body.members[0].brInfos[i].stInfos.length; j++){
                        models.students.create({id_st : req.body.members[0].brInfos[i].stInfos[j].stId, name_st : req.body.members[0].brInfos[i].stInfos[j].stName, id_tc : req.body.members[0].brInfos[i].tcId, id_br : req.headers.userid})
                        .then(() => {
                            console.log("학생 생성");
                            models.stsettings.create({id_st : req.body.members[0].brInfos[i].stInfos[j].stId})
                            .then(() => {console.log("stsettings Success")}).catch(() => {console.log("stsettings 최신")})
                        })
                        .catch(() => {
                            console.log("학생 생성 않음", j);
                        })
                    }
                }
            }).
            then(() => {
                models.stsettings.findAll({attributes : [`id_st`, `ip_st`, `no_st`, `b_lockscreen`]}).then((stsettings) => {
                    var resultResponse = {
                        resultCode : successResultCode, message : successMessage, token : token, 
                        settings : { bBlockBrower : branches.b_blockbrowser, bBlockOtherApps  : branches.b_blockotherapps, 
                        bBlockRemoveApps : branches.b_blockremove,
                        bBlockForceStop : branches.b_blockforcestop, 
                        colorBit : branches.colorbit, imgFps : branches.fps, 
                        }, stInfo : stsettings
                    }
                    res.json(resultResponse);
                })
            })
            .catch(() => {
                models.branches.findOne({where : {id_br : req.headers.userid}})
                .then((branches) => {
                    models.stsettings.findAll({attributes : [`id_st`, `ip_st`, `no_st`, `b_lockscreen`]}).then((stsettings) => {
                        var resultResponse = {
                            resultCode : successResultCode, message : successMessage, token : token, 
                            settings : { bBlockBrower : branches.b_blockbrowser, bBlockOtherApps  : branches.b_blockotherapps, 
                            bBlockRemoveApps : branches.b_blockremove,
                            bBlockForceStop : branches.b_blockforcestop, 
                            colorBit : branches.colorbit, imgFps : branches.fps, 
                            }, stInfo : stsettings
                        }
                        res.json(resultResponse);
                    })
                })
                
            })
    
        })
    }
    // 선생 로그인

    else {
        console.log("여기입니다.");
        models.branches.update(
        {
            name_br : req.body.members[0].brName
        },
        {
            where : {id_br : req.body.members[0].brId}
        })
        models.teachers.findOne({where : {id_tc : req.headers.userid}})
        .then((teachers) => {

            if(teachers !== null){
                models.tcsettings.findOne({where : {id_tc : req.headers.userid}})
                .then((tcsettings) => {tcsettings.update({ip_tc : req.body.ip, thumburl_tc : req.body.upLoadUrl, token_tc : token, os_tc : req.headers.os})})
                .catch(() => {models.tcsettings.create({id_tc : req.headers.userid, ip_tc : req.body.ip, thumburl_tc : req.body.upLoadUrl, token_tc : token, os_tc : req.headers.os})})
                    console.log("tcsetting Update");
                    models.students.destroy({where : { id_tc : req.headers.userid}})
                    .then(() => {
                        console.log("학생 삭제");
                        for(var i = 0 ; i < req.body.members[0].brInfos.length ; i++){
                            if(req.headers.userid === req.body.members[0].brInfos[i].tcId){
                                teachers.update({id_br : req.body.members[0].brId, name_tc : req.body.members[0].brInfos[i].tcName})
                                .then(() => {console.log("teachers Update")}).catch(() => {console.log("teachers 최신")});

                                console.log("생성하는 곳: ", req.body.members[0].brInfos[i].tcId)
                                for(var j = 0 ; j < req.body.members[0].brInfos[i].stInfos.length ; j++){
                                    console.log("ID : ",  req.body.members[0].brInfos[i].stInfos[j].stId, "Name : ",  req.body.members[0].brInfos[i].stInfos[j].stName)
                                    models.students.create({id_st : req.body.members[0].brInfos[i].stInfos[j].stId, name_st : req.body.members[0].brInfos[i].stInfos[j].stName, id_tc : req.headers.userid, id_br : req.body.members[0].brId})
                                    models.stsettings.findOne({where : {id_st : req.body.members[0].brInfos[i].stInfos[j].stId}})
                                    .then((stsettings) => {stsettings.update({ip_tc : req.body.ip})}).catch(() => {
                                        models.stsettings.create({id_st : req.body.members[0].brInfos[i].stInfos[j].stId, ip_tc : req.body.ip})
                                })
                                    .then(() => {
                                        console.log("학생 생성");
                                    })
                                }
                            } 
                            else {
                                console.log("Another Teachers");
                        }
                    }
                }).then(() => {
                    models.branches.findOne({where : {id_br : req.body.members[0].brId}})
                    .then((branches) => {
                        models.stsettings.findAll({attributes : [`id_st`, `ip_st`, `no_st`, `b_lockscreen`]}).then((stsettings) => {
                            var resultResponse = {
                                resultCode : successResultCode, message : successMessage, token : token, 
                                settings : { bBlockBrower : branches.b_blockbrowser, bBlockOtherApps  : branches.b_blockotherapps, 
                                bBlockRemoveApps : branches.b_blockremove,
                                bBlockForceStop : branches.b_blockforcestop, 
                                colorBit : branches.colorbit, imgFps : branches.fps, 
                                }, stInfo : stsettings
                            }
                            res.json(resultResponse);
                        })
                    })
                })
                .catch(()=>{
                    console.log("학생 없음");
                    models.tcsettings.findOne({where : {id_tc : req.headers.userid}})
                    .then((tcsettings) => {tcsettings.update({ip_tc : req.body.ip, thumburl_tc : req.body.upLoadUrl, token_tc : token, os_tc : req.headers.os})})
                    .catch(() => {models.tcsettings.create({id_tc : req.headers.userid, ip_tc : req.body.ip, thumburl_tc : req.body.upLoadUrl, token_tc : token, os_tc : req.headers.os})})
                    for(var i = 0 ; i < req.body.members[0].brInfos.length ; i++){
                        if(req.headers.userid === req.body.members[0].brInfos[i].tcId){
                            teachers.update({id_br : req.body.members[0].brId, name_tc : req.body.members[0].brInfos[i].tcName},{where : {id_tc : req.headers.userid}})
                            .then(() => {console.log("teachers Update")}).catch(() => {console.log("teachers 최신")});

                            console.log("생성하는 곳: ", req.body.members[0].brInfos[i].tcId)
                            for(var j = 0 ; j < req.body.members[0].brInfos[i].stInfos.length ; j++){
                                console.log("ID : ",  req.body.members[0].brInfos[i].stInfos[j].stId, "Name : ",  req.body.members[0].brInfos[i].stInfos[j].stName)
                                models.students.create({id_st : req.body.members[0].brInfos[i].stInfos[j].stId, name_st : req.body.members[0].brInfos[i].stInfos[j].stName, id_tc : req.headers.userid, id_br : req.body.members[0].brId})
                                models.stsettings.findOne({where : {id_st : req.body.members[0].brInfos[i].stInfos[j].stId}})
                                .then((stsettings) => {stsettings.update({ip_tc : req.body.ip})}).catch(() => {
                                    models.stsettings.create({id_st : req.body.members[0].brInfos[i].stInfos[j].stId, ip_tc : req.body.ip})
                            })
                                .then(() => {
                                    console.log("학생 생성");
                                })
                            }
                        } 
                        else {
                            console.log("Another Teachers");
                        }
                    }
                })
            }

            else{
                models.teachers.create({id_br : req.body.members[0].brId, id_tc : req.body.members[0].brInfos[0].tcId, name_tc : req.body.members[0].brInfos[0].tcName})
                .then(() => {
                    console.log("선생 생성");
                    models.tcsettings.findOne({where : {id_tc : req.headers.userid}})
                    .then((tcsettings) => {tcsettings.update({ip_tc : req.body.ip, thumburl_tc : req.body.upLoadUrl, token_tc : token, os_tc : req.headers.os})})
                    .catch(() => {models.tcsettings.create({id_tc : req.headers.userid, ip_tc : req.body.ip, thumburl_tc : req.body.upLoadUrl, token_tc : token, os_tc : req.headers.os})})

                    for(var i = 0 ; i < req.body.members[0].brInfos.length ; i++){
                        if(req.headers.userid === req.body.members[0].brInfos[i].tcId){

                            console.log("생성하는 곳: ", req.body.members[0].brInfos[i].tcId)
                            for(var j = 0 ; j < req.body.members[0].brInfos[i].stInfos.length ; j++){
                                console.log("ID : ",  req.body.members[0].brInfos[i].stInfos[j].stId, "Name : ",  req.body.members[0].brInfos[i].stInfos[j].stName, req.body.members[0].brInfos[i].stInfos.length)
                                models.students.create({id_st : req.body.members[0].brInfos[i].stInfos[j].stId, name_st : req.body.members[0].brInfos[i].stInfos[j].stName, id_tc : req.headers.userid, id_br : req.body.members[0].brId})

                                models.stsettings.create({id_st : req.body.members[0].brInfos[i].stInfos[j].stId, ip_tc : req.body.ip})
                                .then(() => {
                                    console.log("stsettings success")
                                }).catch(() => {console.log("stsettings 최신")})

                            }
                        } 
                        else {
                            console.log("Another Teachers");
                        }
                    }
                }).then(() => {
                    models.branches.findOne({where : {id_br : req.body.members[0].brId}})
                    .then((branches) => {
                        models.stsettings.findAll({attributes : [`id_st`, `ip_st`, `no_st`, `b_lockscreen`]}).then((stsettings) => {
                            var resultResponse = {
                                resultCode : successResultCode, message : successMessage, token : token, 
                                settings : { bBlockBrower : branches.b_blockbrowser, bBlockOtherApps  : branches.b_blockotherapps, 
                                bBlockRemoveApps : branches.b_blockremove,
                                bBlockForceStop : branches.b_blockforcestop, 
                                colorBit : branches.colorbit, imgFps : branches.fps, 
                                }, stInfo : stsettings
                            }
                            res.json(resultResponse);
                        })
                    })
                }).catch(()=>{res.json({ resultCode : failedResultCode, message : failedMessage })})
                
            }
            
        })
    }

    
// ------------------------------------------------------------------------branch PC login

    


    
})
module.exports = router;

/*
							{"stId": "11:3a:9e:50:8f:e9","stName": "티쳐3"},
							{"stId": "33:79:a8:25:8a:61","stName": "티쳐2"},
							{"stId": "22:b7:98:4d:53:d0" ,"stName": "티쳐1"}
*/
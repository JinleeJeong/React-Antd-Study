var express = require('express');
var router = express.Router();
var models = require("../models/index");
var jwt = require('jsonwebtoken');
var secretObj = require('../config/jwt');
var sequelize = require('sequelize')

const crypto = require('crypto');
var key = "928176d63f871d69885fcf4cf23c0b7fcb270f37d8cb4dda5b9a09cb4a7d39e5e9456ef1be57df1";

var failedMessage = 'failed';
var failedResultCode = 400;
var successMessage = 'success';
var successResultCode = 200;

function encrypt(text,key){
    /* 알고리즘과 암호화 key 값으로 셋팅된 클래스를 뱉는다 */
       var cipher = crypto.createCipher('aes-256-cbc',key); 
   
    /* 컨텐츠를 뱉고 */
       var encipheredContent = cipher.update(text,'utf8','hex'); 
   
    /* 최종 아웃풋을 hex 형태로 뱉게 한다*/
       encipheredContent += cipher.final('hex');
   
       return encipheredContent;
   }
   
function decrypt(text,key){

    var decipher = crypto.createDecipher('aes-256-cbc',key);

    var decipheredPlaintext = decipher.update(text,'hex','utf8');

    decipheredPlaintext += decipher.final('utf8');

    return decipheredPlaintext;
}
// --------------------------------------------------------------PC login
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

    
// ------------------------------------------------------------------------ PC login

})

// ------------------------------------------------------------------------ PC logout
router.post('/pc/logout', (req, res, next) => {
    models.branches.findOne({where : {token_br : req.headers.token}})
    .then(branches => {
        if(branches !== null) {
            branches.update({token_br : '', ip_br : '', thumburl_br : ''}, {httpOnly: true})
            res.json({resultCode : successResultCode, message : successMessage})
        }
        else {
            models.tcsettings.findOne({where : {token_tc : req.headers.token}})
            .then((tcsettings) => {
                tcsettings.update({token_tc : '', ip_tc : '', thumburl_tc : ''}, {httpOnly : true})
                res.json({resultCode : successResultCode, message : successMessage})
            }).catch(() => {res.json({ resultCode : failedResultCode, message : failedMessage })})
        }
        
    })
    .catch(() => {
        
    })
})

// ------------------------------------------------------------------------ PC logout

// ----------------------------------------------------------------settings
router.get('/pc/settings', (req, res, next) => {
    models.branches.findAll({attributes : [`id_br`, `colorbit`, `fps`, `b_blockbrowser`, `b_blockotherapps`, `b_blockremove`, `b_blockforcestop`]})
    .then((branches) => {
        if(branches !== null){
            res.json({resultCode : successResultCode, message : successMessage, settings : {branches}})
        }
    })
    .catch(() => {
        res.json({resultCode : failedResultCode, message : failedMessage})
    })
})

router.patch('/pc/settings', (req, res, next) => {


    models.branches.findOne({where : {token_br : req.headers.token}})
    .then((branches) => {
            branches.update({colorbit : req.body.settings.colorBit, fps : req.body.settings.ImgFps, b_blockbrowser : req.body.settings.bBlockBrower, b_blockotherapps : req.body.settings.bBlockOtherApps,
                b_blockremove : req.body.settings.bBlockRemoveApps , b_blockforcestop : req.body.settings.bBlockForceStop})
                .then(() => {
                   res.json({resultCode : successResultCode, message : successMessage})
                })
                .catch(() => {
                   res.json({resultCode : failedResultCode, message : failedMessage})
                })
    }).catch(() => {
        res.json({resultCode : failedResultCode, message : failedMessage})
     })
})
// ----------------------------------------------------------------settings

// ----------------------------------------------------------------lockscreen
router.get('/pc/lockscreen', (req, res, next) => {
    models.stsettings.findAll({attributes : [`id_st`, `b_lockscreen`]})
    .then((stsettings) => {
            res.json({resultCode : successResultCode, message : successMessage, lockscreens : stsettings})
    })
    .catch(() => {
        res.json({resultCode : failedResultCode, message : failedMessage})
    })
})

router.patch('/pc/lockscreen/update', (req, res, next) => {
    for(var i = 0; i < req.body.modLockscreens.length ; i++)
    {
        console.log(req.body.modLockscreens[i].stId)
        models.stsettings.update(
        {
            b_lockscreen : req.body.modLockscreens[i].bLockscreen
            
        }, 
        {
            where : { id_st : req.body.modLockscreens[i].stId }
        })
        .catch(() => {
            res.json({resultCode : failedResultCode, message : failedMessage})
        })
    }
    setTimeout(() => {
        res.json({resultCode : successResultCode, message : successMessage})
    },5000)
})

// ----------------------------------------------------------------lockscreen

// ----------------------------------------------------------------members

router.get('/pc/members', (req, res, next) => {
    var resultArray = [];
    models.students.findAll({include : [
        {
          model : models.stsettings,

          attributes : [`no_st`],
          where : sequelize.where(
          sequelize.col('stsetting.id_st'),
          sequelize.col('students.id_st')
        )
        }
    ], attributes : [`id_st`, `name_st`]})
        .then((results) => {

            for(var i = 0; i < results.length ; i++){
                resultArray.push({
                stId : results[i].id_st,
                stName : results[i].name_st,
                stNo  : results[i].stsetting.no_st
            })
            }
            res.json({resultCode : successResultCode, message : successMessage, stInfos : resultArray});
        })
        .catch(() => {
            res.json({resultCode : failedResultCode, message : failedMessage})
        });
})

router.get('/pc/mems', (req,res, next) => {
    
    /*이제 테스트 해봐야지*/

    var text = "우리는 민족중흥의 역사적 사명을 띄고 이땅에 태어 났다. 조상에 빛난 얼을 오늘에 되살려 안으로 자주독립 자세를 확립하고 밖으로 인류공영에 이바지할 때다";
    var text1 = "인강"
    var hw = encrypt(text,key);
    var hw1 = encrypt(text1,key);
    console.log("################### 인코딩 ##################");
    console.log(hw, "과");
    console.log(hw1);
    console.log("################### 디코딩 ##################");
    console.log( decrypt(hw,key) );
    console.log( decrypt(hw1,key), "이랑" );
    console.log(decrypt('35b3cc60e354ba4036e3bcc090ec254f', key))
})
// ----------------------------------------------------------------members
module.exports = router;


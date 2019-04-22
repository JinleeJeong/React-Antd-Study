var express = require('express');
var router = express.Router();
var models = require("../models/index");
var jwt = require('jsonwebtoken');
var secretObj = require('../config/jwt');
var sequelize = require('sequelize')

const crypto = require('crypto');
var key = '3de222e0600511e98647d663bd873d93';
const Op = sequelize.Op;

var failedMessage = 'failed';
var failedResultCode = 400;
var successResultCode = 200;

function encrypt(text){
    if(text !== null) {
        var cipher = crypto.createCipher('aes-256-cbc','3de222e0600511e98647d663bd873d93'); 
        var encipheredContent = cipher.update(text,'utf8','base64'); 
        encipheredContent += cipher.final('base64');
    
        return encipheredContent;
    }
    else { 
        return null;
    }
    
}
/* 암호화에서 문자열 16자 이하면, update는 null값을 가진다. 
 항상 update + final 형식으로 암호화를 해야한다.
*** Key값은 클라이언트에 노출되지 않도록 한다. *** */
function decrypt(text){
 var decipher = crypto.createDecipher('aes-256-cbc', '3de222e0600511e98647d663bd873d93');
 var decipheredPlaintext = decipher.update(text, 'base64', 'utf8');
 decipheredPlaintext += decipher.final('utf8');

 return decipheredPlaintext;
}

var successMessage = encrypt('success');


// --------------------------------------------------------------PC login
router.post('/pc/login', (req, res, next) => {

    const tokenJwt = jwt.sign({ 
        id_ad : req.body.id_ad //payload(토큰 내용)
     }, secretObj.secret, //비밀키
    { 
        expiresIn: '1m'  // 유효시간
    })
    var token = encrypt(tokenJwt);
    // 브랜치 로그인
    if(req.headers.usertype === "M"){
        
        models.branches.findOne({where : { id_br : decrypt(req.body.members.brId) }}) // 브랜치 찾기 & 업데이트
        .then((branches) => {
            console.log("=====================================================Branches Login==============================================================")
            branches.update({ip_br : decrypt(req.body.ip), thumburl_br : decrypt(req.body.upLoadUrl), id_br : decrypt(req.body.members.brId), name_br : decrypt(req.body.members.brName), os_br : req.headers.os})
            .catch((err)=>{console.log('branches update 최신 : ',err.original.detail)})

            models.managers.findOne({where : {id_user : req.headers.userid}})
            .then((managers) => {managers.update({id_br : decrypt(req.body.members.brId), token_mgr : token})})
            .catch(() => {models.managers.create({id_br : decrypt(req.body.members.brId), token_mgr : token, id_user : req.headers.userid})})

            models.students.destroy({where: { id_br : decrypt(req.body.members.brId)}})
            .then(() => 
            {
                console.log("학생 삭제");
                models.teachers.destroy({where : {id_br : decrypt(req.body.members.brId)}})
                .then(() => 
                {
                    var bulkCreateTeachers = [];
                    var bulkCreateTcsettings = [];
                    var bulkCreateStudents = [];
                    var bulkCreateStsettings = [];
                    console.log("선생 삭제");
                    for(let i = 0 ; i < req.body.members.brInfos.length; i++){
                        bulkCreateTeachers.push({
                            id_tc : decrypt(req.body.members.brInfos[i].tcrId), 
                            name_tc : decrypt(req.body.members.brInfos[i].tcrName), 
                            id_br : decrypt(req.body.members.brId)
                        })
                        bulkCreateTcsettings.push({
                            id_tc : decrypt(req.body.members.brInfos[i].tcrId)
                        })
                        for(let j = 0 ; j < req.body.members.brInfos[i].stInfos.length; j++){
                            bulkCreateStudents.push({
                                id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId), 
                                name_st : decrypt(req.body.members.brInfos[i].stInfos[j].stName), 
                                id_tc : decrypt(req.body.members.brInfos[i].tcrId), 
                                id_br : decrypt(req.body.members.brId)
                            })
                            bulkCreateStsettings.push({
                                id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId)
                            })
                        }  
                    }
                    models.teachers.bulkCreate(bulkCreateTeachers)
                    .then(() => {
                        models.tcsettings.bulkCreate(bulkCreateTcsettings)
                        .catch((err) => {console.log("tcsettings 존재", err.original.detail)})

                        models.stsettings.bulkCreate(bulkCreateStsettings)
                        .catch((err) => {console.log("stsettings 존재", err.original.detail)})

                        models.students.bulkCreate(bulkCreateStudents)
                        .then(() => {
                            var resultArray = []
                            models.branches.findOne({where : {id_br : decrypt(req.body.members.brId)}})
                            .then((branches) => {
                                models.students.findAll({include : [
                                    {
                                    model : models.stsettings,
                                    attributes : [`id_st`, `ip_st`, `no_st`, `b_lockscreen`],
                                    where : sequelize.where(
                                    sequelize.col('stsetting.id_st'),
                                    sequelize.col('students.id_st')
                                    )
                                    }
                                ], attributes : [`name_st`]})
                                .then((students) => {
                                    for(var i = 0 ; i<students.length ; i++) {
                                        resultArray.push({
                                            stId : encrypt(students[i].stsetting.id_st),
                                            stIp : encrypt(students[i].stsetting.ip_st),
                                            stNo : students[i].stsetting.no_st,
                                            stName : encrypt(students[i].name_st),
                                            bLockscreen : students[i].stsetting.b_lockscreen
                                        })
                                    }
                                    var resultResponse = {
                                        resultCode : successResultCode, message : successMessage, token : token, 
                                        settings : { bBlockBrowser : branches.b_blockbrowser, bBlockOtherApps  : branches.b_blockotherapps, 
                                        bBlockRemoveApps : branches.b_blockremove,
                                        bBlockForceStop : branches.b_blockforcestop, 
                                        colorBit : branches.colorbit, imgFps : branches.fps, 
                                        }, stInfo : resultArray
                                    }
                                    res.json(resultResponse);
                                })
                            }).catch((err)=>{console.log("branches findOne Error", err.original.detail)})
                        }).catch((err) => {console.log("students 존재", err.original.detail)})   
                    }).catch((err) => {console.log("Teachers 존재 or Zero", err.original.detail)})
        })
    }).catch((err)=>{console.log("Students Destroy Err", err.original.detail)})

        }).catch(() => {

            models.branches.create({ip_br : decrypt(req.body.ip), thumburl_br : decrypt(req.body.upLoadUrl), id_br : decrypt(req.body.members.brId), name_br : decrypt(req.body.members.brName), os_br : req.headers.os})
            .then(() => {
            console.log("=====================================================Branches Insert==============================================================")
            models.managers.findOne({where : {id_user : req.headers.userid}})
            .then((managers) => {managers.update({id_br : decrypt(req.body.members.brId), token_mgr : token})})
            .catch(() => {models.managers.create({id_br : decrypt(req.body.members.brId), token_mgr : token, id_user : req.headers.userid})})
            var alreadyTeachers = [];
            var alreadyTeachersName = [];
            var newTeachers = [];
            var newTeachersName = [];
            var updateTeachers = [];
            var insertTeachers = [];
            var newTeachersString;

            var bulkCreateTeachers = [];
            var bulkCreateTcsettings = [];
            var bulkCreateStudents = [];
            var bulkCreateStsettings = [];
            
            console.log("브랜치 로그인 : 생성 ");
            models.teachers.findAll() 
            .then((teachersAll) => {
                console.log("success");
                for(var i = 0; i < teachersAll.length ; i++){ // 전체 선생
                    alreadyTeachers.push(teachersAll[i].id_tc);
                    alreadyTeachersName.push(teachersAll[i].name_tc);
                }
                for(var j = 0; j < req.body.members.brInfos.length; j++){ // 입력 선생
                    newTeachers.push(decrypt(req.body.members.brInfos[j].tcrId));
                    newTeachersName.push(decrypt(req.body.members.brInfos[j].tcrName));
                }
                console.log('존재 선생 : ',alreadyTeachers, alreadyTeachersName)
                console.log('새로운 선생 : ',newTeachers, newTeachersName);
                
                updateTeachers = alreadyTeachers.filter((a) => newTeachers.includes(a));
                console.log("update : ", updateTeachers); // 업데이트 선생 ID
                insertTeachers = newTeachers.filter((a) => !alreadyTeachers.includes(a));
                console.log("insertTeachers : ", insertTeachers); // Insert 선생 ID
                for(var z = 0 ; z < newTeachers.length ; z++){
                    newTeachersString = newTeachers[z]
                    console.log(newTeachersString)
                    if(alreadyTeachers.indexOf(newTeachersString) !== -1){
                        console.log("Teachers update!!", z);
                        models.students.destroy({where : {id_tc : newTeachers[z]}})
                        .catch((err) => {console.log("Teachers Update in students null", err.original.detail)})

                        models.teachers.update(
                            {
                                id_tc : newTeachers[z], name_tc : newTeachersName[z], id_br : decrypt(req.body.members.brId)
                            }, 
                            {
                                where : {id_tc : newTeachers[z]}
                            }).then(() => {console.log("teachers Update")
                        
                        })
                            .catch((err) => {console.log("teachers Update X", err.original.detail)})
                    }
                    else {
                        bulkCreateTeachers.push({
                            id_tc : newTeachers[z], 
                            name_tc :newTeachersName[z], 
                            id_br : decrypt(req.body.members.brId)
                        })
                        console.log("Teachers Insert!!", z);
                    }
                }
                for(var i = 0 ; i < insertTeachers.length ; i++){
                    bulkCreateTcsettings.push({
                        id_tc : insertTeachers[i]
                    })
                    for(let j = 0 ; j < req.body.members.brInfos[i].stInfos.length; j++){
                        bulkCreateStudents.push({
                            id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId), 
                            name_st : decrypt(req.body.members.brInfos[i].stInfos[j].stName), 
                            id_tc : decrypt(req.body.members.brInfos[i].tcrId), 
                            id_br : decrypt(req.body.members.brId)
                        })
                        bulkCreateStsettings.push({
                            id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId)
                        })
                    }
                }
                
                models.teachers.bulkCreate(bulkCreateTeachers)
                .then(() => {

                    models.tcsettings.bulkCreate(bulkCreateTcsettings)
                        .catch((err) => {console.log("tcsettings 존재", err.original.detail)})

                        models.stsettings.bulkCreate(bulkCreateStsettings)
                        .catch((err) => {console.log("stsettings 존재", err.original.detail)})

                        models.students.bulkCreate(bulkCreateStudents)
                        .then(() => {
                            var resultArray = []
                            models.branches.findOne({where : {id_br : decrypt(req.body.members.brId)}})
                            .then((branches) => {
                                models.students.findAll({include : [
                                    {
                                    model : models.stsettings,
                                    attributes : [`id_st`, `ip_st`, `no_st`, `b_lockscreen`],
                                    where : sequelize.where(
                                    sequelize.col('stsetting.id_st'),
                                    sequelize.col('students.id_st')
                                    )
                                    }
                                ], attributes : [`name_st`]})
                                .then((students) => {
                                    for(var i = 0 ; i<students.length ; i++) {
                                        resultArray.push({ 
                                            stId : encrypt(students[i].stsetting.id_st),
                                            stIp : encrypt(students[i].stsetting.ip_st),
                                            stNo : students[i].stsetting.no_st,
                                            stName : encrypt(students[i].name_st),
                                            bLockscreen : students[i].stsetting.b_lockscreen
                                            
                                        })
                                    }
                                    var resultResponse = {
                                        resultCode : successResultCode, message : successMessage, token : token, 
                                        settings : { bBlockBrowser : branches.b_blockbrowser, bBlockOtherApps  : branches.b_blockotherapps, 
                                        bBlockRemoveApps : branches.b_blockremove,
                                        bBlockForceStop : branches.b_blockforcestop, 
                                        colorBit : branches.colorbit, imgFps : branches.fps, 
                                        }, stInfo : resultArray
                                    }
                                    res.json(resultResponse);
                                })
                        }).catch((err)=>{console.log("branches findOne Error", err.original.detail)})
                    }).catch((err) => {console.log("students 존재", err.original.detail)})  
                })

            }).catch((err)=>{console.log("Teachers Zero Err", err.original.detail)})
        })})
    }
    // 선생 로그인

    else {
        models.branches.update(
        {
            name_br : decrypt(req.body.members.brName)
        },
        {
            where : {id_br : decrypt(req.body.members.brId)}
        })
        models.teachers.findOne({where : {id_tc : req.headers.userid}})
        .then((teachers) => {
            if(teachers !== null){
                console.log("=====================================================Teachers Login==============================================================");
                models.tcsettings.findOne({where : {id_tc : req.headers.userid}})
                .then((tcsettings) => {tcsettings.update({ip_tc : decrypt(req.body.ip), thumburl_tc : decrypt(req.body.upLoadUrl), token_tc : token, os_tc : req.headers.os})})
                .catch(() => {models.tcsettings.create({id_tc : req.headers.userid, ip_tc : decrypt(req.body.ip), thumburl_tc : decrypt(req.body.upLoadUrl), token_tc : token, os_tc : req.headers.os})})
                    console.log("tcsetting Update");
                    models.students.destroy({where : { id_tc : req.headers.userid}})
                    .then(() => {
                        var bulkCreateStudents = [];
                        var bulkCreateStsettings = [];
                        console.log("학생 삭제");
                        for(var i = 0 ; i < req.body.members.brInfos.length ; i++){
                            if(req.headers.userid === decrypt(req.body.members.brInfos[i].tcrId)){
                                teachers.update({id_br : decrypt(req.body.members.brId), name_tc : decrypt(req.body.members.brInfos[i].tcrName)})
                                .then(() => {console.log("teachers Update")}).catch((err) => {console.log("teachers 최신", err.original.detail)});

                                console.log("생성하는 곳: ", decrypt(req.body.members.brInfos[i].tcrId))
                                for(var j = 0 ; j < req.body.members.brInfos[i].stInfos.length ; j++){
                                    bulkCreateStudents.push({
                                        id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId),
                                         name_st : decrypt(req.body.members.brInfos[i].stInfos[j].stName),
                                          id_tc : req.headers.userid,
                                           id_br : decrypt(req.body.members.brId)
                                    })
                                    bulkCreateStsettings.push({
                                        id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId),
                                         ip_tc : decrypt(req.body.ip)
                                    })
                                    models.stsettings.update({ip_tc : decrypt(req.body.ip)}, {
                                        where : {id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId)}
                                    }).then(() => {console.log("stsettings Update")}).catch((err) => {console.log("stsettings Update 최신",err.original.detail)}); 
                                }
                            } 
                            else {
                                console.log("Another Teachers", i);
                        }
                    }
                    
                        models.students.bulkCreate(bulkCreateStudents)
                        .then(() => {
                            var resultArray = []

                            models.stsettings.bulkCreate(bulkCreateStsettings)
                            .catch((err) => {console.log("stsettings Create 최신", err.original.detail)})

                            models.branches.findOne({where : {id_br : decrypt(req.body.members.brId)}})
                            .then((branches) => {
                                models.students.findAll({include : [
                                    {
                                        model : models.stsettings,
                                        attributes : [`id_st`, `ip_st`, `no_st`, `b_lockscreen`],
                                        where : sequelize.where(
                                            sequelize.col('stsetting.id_st'),
                                            sequelize.col('students.id_st')
                                        )
                                    }
                                ], attributes : ['name_st'], where : {id_tc : req.headers.userid}})
                                .then((students) => {
                                    for(var i = 0 ; i<students.length ; i++) {
                                        resultArray.push({
                                            stId : encrypt(students[i].stsetting.id_st),
                                            stIp : encrypt(students[i].stsetting.ip_st),
                                            stNo : students[i].stsetting.no_st,
                                            stName : encrypt(students[i].name_st),
                                            bLockscreen : students[i].stsetting.b_lockscreen
                                            
                                        })
                                    }
        
                                    var resultResponse = {
                                        resultCode : successResultCode, message : successMessage, token : token, 
                                        settings : { bBlockBrowser : branches.b_blockbrowser, bBlockOtherApps  : branches.b_blockotherapps, 
                                        bBlockRemoveApps : branches.b_blockremove,
                                        bBlockForceStop : branches.b_blockforcestop, 
                                        colorBit : branches.colorbit, imgFps : branches.fps, 
                                        }, stInfo : resultArray
                                    }
                                    res.json(resultResponse);
                                })
                            })
                        })
                        
                    
                }).catch(()=>{
                    console.log("학생 없음");
                    models.tcsettings.findOne({where : {id_tc : req.headers.userid}})
                    .then((tcsettings) => {tcsettings.update({ip_tc : decrypt(req.body.ip), thumburl_tc : decrypt(req.body.upLoadUrl), token_tc : token, os_tc : req.headers.os})})
                    .catch(() => {models.tcsettings.create({id_tc : req.headers.userid, ip_tc : decrypt(req.body.ip), thumburl_tc : decrypt(req.body.upLoadUrl), token_tc : token, os_tc : req.headers.os})})
                    
                    var bulkCreateStudents = [];
                    var bulkCreateStsettings = [];

                    for(var i = 0 ; i < req.body.members.brInfos.length ; i++){
                        if(req.headers.userid === decrypt(req.body.members.brInfos[i].tcrId)){
                            models.teachers.update({id_br : decrypt(req.body.members.brId), name_tc : decrypt(req.body.members.brInfos[i].tcrName)},{where : {id_tc : req.headers.userid}})
                            .then(() => {console.log("teachers Update")}).catch(() => {console.log("teachers 최신")});

                            console.log("생성하는 곳: ", decrypt(req.body.members.brInfos[i].tcrId))
                            for(var j = 0 ; j < req.body.members.brInfos[i].stInfos.length ; j++){
                                bulkCreateStudents.push({
                                    id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId), 
                                    name_st : decrypt(req.body.members.brInfos[i].stInfos[j].stName), 
                                    id_tc : req.headers.userid, 
                                    id_br : decrypt(req.body.members.brId)
                                })
                                bulkCreateStsettings.push({
                                    id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId), ip_tc : decrypt(req.body.ip)
                                })
                                models.stsettings.update({ip_tc : decrypt(req.body.ip)}, {
                                    where : {id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId)}
                                }).then(() => {console.log("stsettings Update")}).catch((err) => {console.log("stsettings Update 최신", err.original.detail)});
                            }
                        } 
                        else {
                            console.log("Another Teachers");
                        }
                    }
                    models.students.bulkCreate(bulkCreateStudents)
                        .then(() => {
                            var resultArray = []

                            models.stsettings.bulkCreate(bulkCreateStsettings)
                            .catch((err) => {console.log("stsettings Create 최신", err.original.detail)})

                            models.branches.findOne({where : {id_br : decrypt(req.body.members.brId)}})
                            .then((branches) => {
                                models.students.findAll({include : [
                                    {
                                        model : models.stsettings,
                                        attributes : [`id_st`, `ip_st`, `no_st`, `b_lockscreen`],
                                        where : sequelize.where(
                                            sequelize.col('stsetting.id_st'),
                                            sequelize.col('students.id_st')
                                        )
                                    }
                                ], attributes : ['name_st'], where : {id_tc : req.headers.userid}})
                                .then((students) => {
                                    for(var i = 0 ; i<students.length ; i++) {
                                        resultArray.push({
                                            stId : encrypt(students[i].stsetting.id_st),
                                            stIp : encrypt(students[i].stsetting.ip_st),
                                            stNo : students[i].stsetting.no_st,
                                            stName : encrypt(students[i].name_st),
                                            bLockscreen : students[i].stsetting.b_lockscreen
                                            
                                        })
                                    }
        
                                    var resultResponse = {
                                        resultCode : successResultCode, message : successMessage, token : token, 
                                        settings : { bBlockBrowser : branches.b_blockbrowser, bBlockOtherApps  : branches.b_blockotherapps, 
                                        bBlockRemoveApps : branches.b_blockremove,
                                        bBlockForceStop : branches.b_blockforcestop, 
                                        colorBit : branches.colorbit, imgFps : branches.fps, 
                                        }, stInfo : resultArray
                                    }
                                    res.json(resultResponse);
                                })
                            })
                        })

                })
            }

            else{
                for(var i = 0 ; i < req.body.members.brInfos.length ; i++)
                {
                    if(req.headers.userid === decrypt(req.body.members.brInfos[i].tcrId)){
                        models.teachers.create({id_br : decrypt(req.body.members.brId), id_tc : decrypt(req.body.members.brInfos[i].tcrId), name_tc : decrypt(req.body.members.brInfos[i].tcrName)})
                        .then(() => {console.log("=====================================================Teachers Insert==============================================================")})
                        .catch((err) => {console.log("teachers 존재 : ", err.original.detail)})  
                    }
                    else{
                        console.log("Another Teachers create", i)
                    }  
                }
                var bulkCreateStudents = [];
                var bulkCreateStsettings = [];
                models.students.destroy({where : {id_tc : req.headers.userid}})
                .catch((err) => {console.log("students clean", err.original.detail)})
                models.tcsettings.create({id_tc : req.headers.userid, ip_tc : decrypt(req.body.ip), thumburl_tc : decrypt(req.body.upLoadUrl), token_tc : token, os_tc : req.headers.os})
                .then(() => {

                    for(var i = 0 ; i < req.body.members.brInfos.length ; i++){
                        if(req.headers.userid === decrypt(req.body.members.brInfos[i].tcrId)){

                            console.log("생성하는 곳: ", decrypt(req.body.members.brInfos[i].tcrId))
                            for(var j = 0 ; j < req.body.members.brInfos[i].stInfos.length ; j++){
                                bulkCreateStudents.push({
                                    id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId),
                                    name_st : decrypt(req.body.members.brInfos[i].stInfos[j].stName), 
                                    id_tc : req.headers.userid,
                                    id_br : decrypt(req.body.members.brId)
                                })
                                bulkCreateStsettings.push({
                                    id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId), ip_tc : decrypt(req.body.ip)
                                })
                                models.stsettings.update({ip_tc : decrypt(req.body.ip)}, {
                                    where : {id_st : decrypt(req.body.members.brInfos[i].stInfos[j].stId)}
                                }).then(() => {console.log("stsettings Update")}).catch((err) => {console.log("stsettings Update 최신", err.original.detail)});

                            }
                        } 
                        else {
                            console.log("Another Teachers Students Create", i);
                        }
                    }
                
                    models.students.bulkCreate(bulkCreateStudents)
                        .then(() => {
                            var resultArray = []

                            models.stsettings.bulkCreate(bulkCreateStsettings)
                            .catch((err) => {console.log("stsettings Create 최신", err.original.detail)})

                            models.branches.findOne({where : {id_br : decrypt(req.body.members.brId)}})
                            .then((branches) => {
                                models.students.findAll({include : [
                                    {
                                        model : models.stsettings,
                                        attributes : [`id_st`, `ip_st`, `no_st`, `b_lockscreen`],
                                        where : sequelize.where(
                                            sequelize.col('stsetting.id_st'),
                                            sequelize.col('students.id_st')
                                        )
                                    }
                                ], attributes : ['name_st'], where : {id_tc : req.headers.userid}})
                                .then((students) => {
                                    for(var i = 0 ; i<students.length ; i++) {
                                        resultArray.push({
                                            stId : encrypt(students[i].stsetting.id_st),
                                            stIp : encrypt(students[i].stsetting.ip_st),
                                            stNo : students[i].stsetting.no_st,
                                            stName : encrypt(students[i].name_st),
                                            bLockscreen : students[i].stsetting.b_lockscreen,
                                            
                                        })
                                    }
        
                                    var resultResponse = {
                                        resultCode : successResultCode, message : successMessage, token : token, 
                                        settings : { bBlockBrowser : branches.b_blockbrowser, bBlockOtherApps  : branches.b_blockotherapps, 
                                        bBlockRemoveApps : branches.b_blockremove,
                                        bBlockForceStop : branches.b_blockforcestop, 
                                        colorBit : branches.colorbit, imgFps : branches.fps, 
                                        }, stInfo : resultArray
                                    }
                                    res.json(resultResponse);
                                })
                            })
                        })
                }).catch(()=>{console.log("tcsettings 최신", err.original.detail)})   
            }
        })
    }
})
// ------------------------------------------------------------------------ PC login

// ------------------------------------------------------------------------ PC logout
router.post('/pc/logout', (req, res, next) => {
    models.managers.findOne({where : {id_user : req.headers.userid}})
    .then(managers => {
        if(managers !== null) {
            managers.update({token_mgr : ''}, {httpOnly: true})
            res.json({resultCode : successResultCode, message : successMessage})
        }
        else {
            models.tcsettings.findOne({where : {id_tc : req.headers.userid}})
            .then((tcsettings) => {
                tcsettings.update({token_tc : '', ip_tc : '', thumburl_tc : ''}, {httpOnly : true})
                res.json({resultCode : successResultCode, message : successMessage})
            }).catch((err) => {console.log("tcsettings 없음", err.original.detail)})
        }
        
    })
    .catch((err) => {
        console.log("branches 없음", err.original.detail)
    })
})

// ------------------------------------------------------------------------ PC logout

// ----------------------------------------------------------------settings
router.get('/pc/settings', (req, res, next) => {
    var result;
    models.branches.findOne({attributes : [`b_blockbrowser`, `b_blockotherapps`, `b_blockremove`, `b_blockforcestop`,`colorbit`, `fps`], where : {id_br : decrypt(req.headers.userid)}})
    .then((branches) => {
        result = {
            bBlockBrower : branches.b_blockbrowser,
            bBlockOtherApps : branches.b_blockotherapps,
            bBlockRemoveApps : branches.b_blockremove,
            bBlockForceStop : branches.b_blockforcestop,
            colorBit : branches.colorbit,
            ImgFps : branches.fps
        }
        if(branches !== null){
            res.json({resultCode : successResultCode, message : successMessage, settings : result})
        }
    })
    .catch((err) => {
        console.log("branches 없음 : ", err.original.detail)
    })
})

router.patch('/pc/settings', (req, res, next) => {


    models.branches.findOne({where : {id_br : decrypt(req.headers.userid)}})
    .then((branches) => {
            branches.update({colorbit : req.body.settings.colorBit, fps : req.body.settings.ImgFps, b_blockbrowser : req.body.settings.bBlockBrower, b_blockotherapps : req.body.settings.bBlockOtherApps,
                b_blockremove : req.body.settings.bBlockRemoveApps , b_blockforcestop : req.body.settings.bBlockForceStop})
                .then(() => {
                   res.json({resultCode : successResultCode, message : successMessage})
                })
                .catch((err) => {
                   console.log("branches 최신", err.original.detail)
                })
    }).catch((err) => {
        console.log("branches 없음 : ", err.original.detail)
     })
})
// ----------------------------------------------------------------settings

// ----------------------------------------------------------------lockscreen
router.get('/pc/lockscreen', (req, res, next) => {
    var resultArray = []
    models.stsettings.findAll({attributes : [`id_st`, `b_lockscreen`]})
    .then((stsettings) => {
        for(var i = 0 ; i <stsettings.length ; i++){
            resultArray.push({
                stId  : encrypt(stsettings[i].id_st),
                bLockscreen  : stsettings[i].b_lockscreen
            })
        }
        console.log(resultArray);
            res.json({resultCode : successResultCode, message : successMessage, lockscreens : resultArray})
    })
    .catch((err) => {
        console.log("stsettings Zero", err.original.detail)
    })
})

router.patch('/pc/lockscreen', (req, res, next) => {
    console.log(req.body);
    console.log(req.body.modLockscreens.length);
    for(var i = 0; i < req.body.modLockscreens.length ; i++)
    {
        models.stsettings.update(
        {
            b_lockscreen : req.body.modLockscreens[i].bLockscreen
            
        }, 
        {
            where : { id_st : decrypt(req.body.modLockscreens[i].stId) }
        })
        .catch((err) => {
            console.log("stsettings 최신", err.original.detail)
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
                stId : encrypt(results[i].id_st),
                stName : encrypt(results[i].name_st),
                stNo  : results[i].stsetting.no_st
            })
            }
            res.json({resultCode : successResultCode, message : successMessage, stInfos : resultArray});
        })
        .catch((err) => {
            console.log("Studetns Zero", err.original.detail)
        });
})

router.post('/pc/members', (req,res,next) => {
    var resultArray = [];
    var bulkCreate = [];
    var bulkCreateForSetting = [];
    for(var i = 0; i < req.body.stInfos.length; i++){
        bulkCreate.push({
            id_st : decrypt(req.body.stInfos[i].stId),
            name_st : decrypt(req.body.stInfos[i].stName)
        })
        bulkCreateForSetting.push({
            id_st : decrypt(req.body.stInfos[i].stId),
            no_st : req.body.stInfos[i].stNo
        })
    }
    console.log(bulkCreate, bulkCreateForSetting, "BulkCreate");
    models.stsettings.bulkCreate(bulkCreateForSetting)
    .catch((err) => {
        console.log("stsetting Create 존재", err.original.detail)
    })
    models.students.bulkCreate(bulkCreate)
    .then(() => {
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
                    stId : encrypt(results[i].id_st),
                    stName : encrypt(results[i].name_st),
                    stNo  : results[i].stsetting.no_st
                })
                }
                res.json({resultCode : successResultCode, message : successMessage, stInfos : resultArray })
            })
            .catch(() => {
                console.log("studetns Zero ", err.original.detail)
            });
    })
    .catch((err) => {
        console.log("studetns Create 존재", err.original.detail)
    })
})

router.delete('/pc/members', (req,res,next) => {
    var deleteArray = [];
    var resultArray = [];
    for(var i = 0; i< req.body.stInfos.length; i++) {
        deleteArray.push(decrypt(req.body.stInfos[i].stId));
    }
    console.log(deleteArray);

    models.students.destroy({where : {id_st : deleteArray}})
    models.stsettings.destroy({where : {id_st : deleteArray}})
    .then(() => {
        models.students.findAll({attributes : [`id_st`, `name_st`]})
        .then((students) => {
    
            for(var i = 0 ; i <students.length ; i++){
                console.log(students[i].id_st)
                resultArray.push({
                    stId : encrypt(students[i].id_st),
                    stName : encrypt(students[i].name_st)
                })
            }
            res.json({resultCode : successResultCode, message : successMessage, stInfos : resultArray})
        })
        .catch((err) => {
            console.log("students Zero " , err.original.detail)
        });
    })
    .catch((err) => {
        console.log("stsettings Zero " , err.original.detail)
    });
})

router.patch('/pc/members', (req,res,next) => {
    var resultArray = [];
    var findAllArray = [];

    console.log("Members Patch")
    console.log("length", req.body.stInfos.length);
    for(var i = 0; i < req.body.stInfos.length; i++){
        models.students.update({name_st : decrypt(req.body.stInfos[i].stName)},{where : {id_st : decrypt(req.body.stInfos[i].stId)}})
        .then(() => {console.log("students Update")}).catch((err) => {
            console.log("students 최신", err.original.detail)
        })
        models.stsettings.update({no_st : req.body.stInfos[i].stNo},{where : {id_st : decrypt(req.body.stInfos[i].stId)}})
        .then(() => {console.log("stsettings Update")}).catch((err) => {
            console.log("stsettings 최신", err.original.detail)
        })
    }
    setTimeout(() => {

        for(var i = 0 ; i <req.body.stInfos.length; i++)
        {
            findAllArray.push(decrypt(req.body.stInfos[i].stId))
        }

        models.students.findAll({attributes : [`id_st`, `name_st`], where: {id_st : { [Op.in] : findAllArray }}})
        .then((students) => {
            for(var j = 0 ; j <students.length ; j++){
                console.log(students[j].id_st)
                resultArray.push({
                    stId : encrypt(students[j].id_st),
                    stName : encrypt(students[j].name_st)
                })
            }
            res.json({resultCode : successResultCode, message : successMessage, stInfos : resultArray})
        })
        .catch((err) => {
            console.log("students Zero")
        });
    },3000)

})

// ----------------------------------------------------------------members

// ----------------------------------------------------------------logs

router.get('/pc/logs', (req,res,next) => {
    var resultArray = [];
    models.stlogs.findAll({
        include : [
        {
            model : models.students,
            attributes : [`name_st`],
            where : sequelize.where(
                sequelize.col('stlogs.id_st'),
                sequelize.col('student.id_st')
            )
        }
    ], attributes : [`id_st`, `logtype`, `logmsg`, `endtime`, `starttime`]})
    .then((results) => {
        for(var i = 0; i < results.length; i++){
            resultArray.push({
                stId : encrypt(results[i].id_st),
                stName : encrypt(results[i].student.name_st),
                logType : results[i].logtype,
                logContents : encrypt(results[i].logmsg),
                startTime : results[i].starttime,
                endTime : results[i].endtime,
            })
        }
        res.json({resultCode : successResultCode, message : successMessage, logs : resultArray});
    })
    .catch((err) => {
        console.log("stlogs Zero" , err.original.detail)
    });
})

// ----------------------------------------------------------------logs

// ----------------------------------------------------------------dashboard

router.get('/pc/dashboard', (req,res,next) => {


})

// ----------------------------------------------------------------dashboard
module.exports = router;

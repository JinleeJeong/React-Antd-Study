// 조회 쿼리
var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
var sequelize = require('sequelize')
var key = require("../config/cry");
const crypto = require('crypto');
const ivBuffer = ''

const Op = sequelize.Op;
var failedResultCode = 400;
var successResultCode = 200;

function encrypt(text){
    if(typeof text == 'string' && text !== null) {
        var cipher = crypto.createCipheriv('aes-256-cbc',key.crtSecret, ivBuffer); 
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
    if(typeof text == 'string' && text !== null && text !== 'null'){
        var decipher = crypto.createDecipheriv('aes-256-cbc', key.crtSecret, ivBuffer);
        var decipheredPlaintext = decipher.update(text, 'base64', 'utf8');
        decipheredPlaintext += decipher.final('utf8');

        return decipheredPlaintext;
    }
    else {
        return null;
    }
}
var successMessage = encrypt('success');
var failedMessage =  encrypt('failed');

/* GET users listing. */
router.post('/sp/stusg', (req,res,next) => {
    var startChoose = new Date(req.headers.startchoose);
    var endChoose = new Date(req.headers.endchoose);
  startChoose.setHours(startChoose.getHours() + 9);
  endChoose.setHours(endChoose.getHours() + 9);
  console.log(startChoose);
  console.log(endChoose);
models.stlogs.findAll({where : {starttime : { [Op.gte] : startChoose,
                                              [Op.lte] : endChoose},
                                  endtime : { [Op.gte] : startChoose,
                                              [Op.lte] : endChoose}},
      include : [
    {
        model : models.students,
        attributes : [`id_st`, `id_tc`, `name_st`],
        where : sequelize.where(
        sequelize.col('stlogs.id_st'),
        sequelize.col('student.id_st')
        )
    }
  ], order : [
      'id_app'
  ]
  , attributes : [`id_app`, `name_app`, `starttime`, `endtime`, `logtype`]})
  .then((stUsage) => {

    console.log(stUsage.length);

    var result = []
    var jsonResult = []
    var teachersName = []
    var startTime, endTime, hDiff, minDiff, minDiffForHours;
    var usageArray = [];
    var minResult = 0;

    for(var i = 0 ; i<stUsage.length ; i++){
        if(stUsage[i].endtime !== null && stUsage[i].id_app !== null && stUsage[i].name_app !== null && stUsage[i].logtype <= 2){
            
            console.log('Here : ', stUsage[i].logtype)
            
            startTime = new Date(stUsage[i].starttime);
            endTime = new Date(stUsage[i].endtime);
            minResult = Math.abs(startTime - endTime);
            minDiff = Math.floor(((minResult/1000) / 60) % 60);
            minDiffForHours = Math.floor((minResult/1000) / 60);
            hDiff = Math.floor((minDiffForHours / 60));

            usageArray.push({
                stName : stUsage[i].student.name_st,
                tcId : stUsage[i].student.id_tc,
                appId : stUsage[i].id_app,
                appName : stUsage[i].name_app,
                usage : minDiff,
                usageHours : hDiff,
            })
        }
    }

    // obj key value에 따른 New Array Obj 생성
    usageArray.forEach(function (o) {
        if (!this[o.appId]) {
            this[o.appId] = { stName : o.stName, tcId : o.tcId, appId: o.appId, appName : o.appName, usage: 0, usageHours :0};
            result.push(this[o.appId]);
        }
        this[o.appId].usage += o.usage;
        this[o.appId].usageHours += o.usageHours;
    }, Object.create(null));
    
    for(var i = 0 ; i < result.length ; i++){
        models.teachers.findOne({where : {id_tc : result[i].tcId}})
        .then((teachers) => {
            if(teachers !== null) {
                teachersName.push({ tcName : teachers.name_tc})
            }
            else {
                console.log("Teachers Not existes");
            }
        }).catch(() => {
            console.log("Teachers Not exist");
        })
    }

    setTimeout(() => {
        for(var i = 0 ; i < result.length;  i++) {
            var finalUsage = result[i].usageHours + '시간 ' + result[i].usage + '분 사용';
            jsonResult.push({
                key : i,
                stName : encrypt(result[i].stName),
                tcName : encrypt(teachersName[i].tcName),
                appId : encrypt(result[i].appId),
                appName : encrypt(result[i].appName),
                usage : encrypt(finalUsage)
            })
        }
        console.log('jsonResult',jsonResult);

        res.json({
            resultCode : successResultCode,
            message : successMessage,
            stUsages : jsonResult
        });
    }, 3000)
})
  .catch(() => {
      res.json("일치하는 정보가 없습니다.");
  })
});

//================================================================================================

router.post('/sp/ingangusg', (req,res,next) => {
    var startChoose = new Date(req.headers.startchoose);
    var endChoose = new Date(req.headers.endchoose);
    startChoose.setHours(startChoose.getHours() + 9);
    endChoose.setHours(endChoose.getHours() + 9);
    console.log(startChoose);
    console.log(endChoose);

    models.stlogs.findAll({where : {starttime : { [Op.gte] : startChoose,
                                                  [Op.lte] : endChoose},
                                    endtime : { [Op.gte] : startChoose,
                                                [Op.lte] : endChoose}},
        include : [
      {
          model : models.applist,
          attributes : [`b_ingang`],
          where : sequelize.where(
              sequelize.col('stlogs.id_app'),
              sequelize.col('applist.id_app'),
              
          )
      }
    ], order : [
        'id_app'
    ]
    , attributes : [`id_app`, `name_app`, `starttime`, `endtime`, `logtype`]})
    .then((ingangUsg) => {
  
      console.log(ingangUsg.length);
  
      var result = []
      var jsonResult = []
      var startTime, endTime, hDiff, minDiff, minDiffForHours;
      var usageArray = [];
      var minResult = 0;
  
      for(var i = 0 ; i<ingangUsg.length ; i++){
          if(ingangUsg[i].endtime !== null && ingangUsg[i].applist.b_ingang === true && ingangUsg[i].id_app !== null && ingangUsg[i].name_app !== null && ingangUsg[i].logtype <= 2){
  
              console.log('log type : ',ingangUsg[i].logtype)
              startTime = new Date(ingangUsg[i].starttime);
              endTime = new Date(ingangUsg[i].endtime);
              minResult = Math.abs(startTime - endTime);
              minDiff = Math.floor(((minResult/1000) / 60) % 60);
              minDiffForHours = Math.floor((minResult/1000) / 60);
              hDiff = Math.floor((minDiffForHours / 60));
  
              usageArray.push({
                  appId : ingangUsg[i].id_app,
                  appName : ingangUsg[i].name_app,
                  usage : minDiff,
                  usageHours : hDiff,
              })
          }
      }
      console.log(usageArray.length);
      // obj key value에 따른 New Array Obj 생성
      usageArray.forEach(function (o) {
          if (!this[o.appId]) {
              this[o.appId] = {appId: o.appId, appName : o.appName, usage: 0, usageHours :0};
              result.push(this[o.appId]);
          }
          this[o.appId].usage += o.usage;
          this[o.appId].usageHours += o.usageHours;
      }, Object.create(null));
    
      setTimeout(() => {
          for(var i = 0 ; i < result.length;  i++) {
              var finalUsage = result[i].usageHours + '시간 ' + result[i].usage + '분 사용';
              jsonResult.push({
                  key : i,
                  appId : encrypt(result[i].appId),
                  appName : encrypt(result[i].appName),
                  usage : encrypt(finalUsage)
              })
          }
          console.log('jsonResult',jsonResult);
  
          res.json({
              resultCode : successResultCode,
              message : successMessage,
              ingangUsages : jsonResult
          });
      }, 3000)
  })
    .catch(() => {
        res.json("일치하는 정보가 없습니다.");
    })
  });
//================================================================================================

router.post('/sp/disableappusg', (req,res,next) => {

    var startChoose = new Date(req.headers.startchoose);
    var endChoose = new Date(req.headers.endchoose);
    startChoose.setHours(startChoose.getHours() + 9);
    endChoose.setHours(endChoose.getHours() + 9);
    console.log(startChoose);
    console.log(endChoose);

    models.stlogs.findAll({where : {starttime : { [Op.gte] : startChoose,
                                                  [Op.lte] : endChoose},
                                    endtime : { [Op.gte] : startChoose,
                                                [Op.lte] : endChoose}},
        include : [
      {
          model : models.applist,
          attributes : [`b_ingang`],
          where : sequelize.where(
              sequelize.col('stlogs.id_app'),
              sequelize.col('applist.id_app'),
              
          )
      }
    ], order : [
        'id_app'
    ]
    , attributes : [`id_app`, `name_app`, `starttime`, `endtime`, `logtype`]})
    .then((appUsg) => {
  
      console.log(appUsg.length);
  
      var result = []
      var jsonResult = []
      var startTime, endTime, hDiff, minDiff, minDiffForHours;
      var usageArray = [];
      var minResult = 0;
        
      for(var i = 0 ; i<appUsg.length ; i++){
          if(appUsg[i].endtime !== null && appUsg[i].id_app !== null && appUsg[i].name_app !== null && appUsg[i].logtype <= 2){
              
              startTime = new Date(appUsg[i].starttime);
              endTime = new Date(appUsg[i].endtime);
              minResult = Math.abs(startTime - endTime);
              minDiff = Math.floor(((minResult/1000) / 60) % 60);
              minDiffForHours = Math.floor((minResult/1000) / 60);
              hDiff = Math.floor((minDiffForHours / 60));
  
              usageArray.push({
                  appId : appUsg[i].id_app,
                  appName : appUsg[i].name_app,
                  usage : minDiff,
                  usageHours : hDiff,
              })
          }
      }
      
      console.log(usageArray.length);
      // obj key value에 따른 New Array Obj 생성
      usageArray.forEach(function (o) {
          if (!this[o.appId]) {
              this[o.appId] = {appId: o.appId, appName : o.appName, usage: 0, usageHours :0};
              result.push(this[o.appId]);
          }
          this[o.appId].usage += o.usage;
          this[o.appId].usageHours += o.usageHours;
      }, Object.create(null));
    
      setTimeout(() => {
          for(var i = 0 ; i < result.length;  i++) {
              var finalUsage = result[i].usageHours + '시간 ' + result[i].usage + '분 사용';
              jsonResult.push({
                  key : i,
                  appId : encrypt(result[i].appId),
                  appName : encrypt(result[i].appName),
                  usage : encrypt(finalUsage)
              })
          }
          console.log('jsonResult',jsonResult);
  
          res.json({
              resultCode : successResultCode,
              message : successMessage,
              disableAppUsages : jsonResult
          });
      }, 3000)
  })
    .catch(() => {
        res.json("일치하는 정보가 없습니다.");
    })
  });
module.exports = router;

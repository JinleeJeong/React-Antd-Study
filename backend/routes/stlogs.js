var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
var sequelize = require('sequelize')

var failedResultCode = 400;
var successResultCode = 200;
var successMessage = 'success';
var failedMessage =  'failed';
/* GET users listing. */
router.get('/sp/stusg', (req,res,next) => {
  models.stlogs.findAll({
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
  , attributes : [`id_app`, `name_app`, `starttime`, `endtime`]})
  .then((stUsage) => {

    var result = []
    var jsonResult = []
    var teachersName = []
    var startTime, endTime, hDiff, minDiff, minDiffForHours;
    var usageArray = [];
    var minResult = 0;

    for(var i = 0 ; i<stUsage.length ; i++){
        if(stUsage[i].endtime !== null){

            
            startTime = new Date(stUsage[i].starttime);
            endTime = new Date(stUsage[i].endtime);
            minResult = Math.abs(startTime - endTime);
            minDiff = Math.floor(((minResult/1000) / 60) % 60);
            minDiffForHours = Math.floor((minResult/1000) / 60);
            hDiff = Math.floor((minDiffForHours / 60));
            // if(minDiff % 60 > 0){
            //     console.log('true');
            //     minDiff = minDiff % 60
            // }
            console.log(stUsage[i].student.id_st, 'Minutes : ',minDiff, 'hDiff : ',hDiff);
            usageArray.push({
                stName : stUsage[i].student.name_st,
                tcId : stUsage[i].student.id_tc,
                appId : stUsage[i].id_app,
                appName : stUsage[i].name_app,
                usage : minDiff,
                usageHours : hDiff
            })
        }
    // stUsage_Id.push(stUsage[i].student.id_st)
    }
    console.log(usageArray);
    
    // obj key value에 따른 New Array Obj 생성
    usageArray.forEach(function (o) {
        if (!this[o.appId]) {
            this[o.appId] = { stName : o.stName, tcId : o.tcId, appId: o.appId, appName : o.appName, usage: 0, usageHours :0 };
            result.push(this[o.appId]);
        }
        this[o.appId].usage += o.usage;
        this[o.appId].usageHours += o.usageHours;
    }, Object.create(null));
    
    console.log(result);
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
            jsonResult.push({
                stName : result[i].stName,
                tcName : teachersName[i].tcName,
                appId : result[i].appId,
                appName : result[i].appName,
                usage : result[i].usage,
                usageHours : result[i].usageHours
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


router.put('/sp/members/:id', (req, res, next) => {
  models.stlogs.update(
    {
      id_st : req.body.id_st,
      id_tc : req.body.id_tc,
      name_app : req.body.name_app,
      id_app : req.body.id_app,
      starttime : req.body.startTime,
    }, 
      {
        where : { idx : req.params.id }
      }).then(users => { res.json(users);
  });
});


router.delete('/sp/stusg/delete/:id', (req, res, next) =>{
  models.stlogs.destroy(
    {
      where : { idx : req.params.id}
    })
  .then(users => {
     res.json(users);
  })
});

module.exports = router;

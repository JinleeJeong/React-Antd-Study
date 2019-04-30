// 앱 업데이트
var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
const sequelize = require('sequelize');
var key = require("../config/cry");
const crypto = require('crypto');
const ivBuffer = '0000000000000000'
const Op = sequelize.Op;

var failedResultCode = 414;

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
router.get('/sp/appverinfos', (req,res,next) => {
  models.appverinfo.findAll()
    .then((results) => {
    var resultsArray = [];
    for(var i = 0 ; i < results.length ; i++){
        resultsArray.push({
            key : results[i].idx,
            updateVer : encrypt(results[i].version),
            updateType : encrypt(results[i].type),
            updateUrl : encrypt(results[i].url),
            bActivated : results[i].b_activated,
        })
      }
      res.json({ resultCode : successResultCode, message : successMessage, updateHistory : resultsArray})
    })
    .catch(err => {
      console.error(err);
      res.json({ resultCode : failedResultCode, message : failedMessage })
    });
});

router.post('/sp/appverinfos', (req, res, next) => {
  models.appverinfo.create(
    {
      version : decrypt(req.body.version),
      type : decrypt(req.body.type),
      url : decrypt(req.body.url),
    }, 
    ).then(() => { 
        models.appverinfo.findAll()
            .then((results) => {
            var resultsArray = [];
            for(var i = 0 ; i < results.length ; i++){
                resultsArray.push({
                    key : results[i].idx,
                    updateVer : encrypt(results[i].version),
                    updateType : encrypt(results[i].type),
                    updateUrl : encrypt(results[i].url),
                    bActivated : results[i].b_activated,
                })
            }
            res.json({ resultCode : successResultCode, message : successMessage, updateHistory : resultsArray})
            })
            .catch(err => {
            console.error(err);
            res.json({ resultCode : failedResultCode, message : failedMessage })
            });
        
  }).catch(err => {
    console.error(err);
    res.json({ resultCode : failedResultCode, message : failedMessage })
});
});

/* UPDATE appverinfo */

router.patch('/sp/appverinfos/:id', (req, res, next) => {
  models.appverinfo.update(
    {
      version : decrypt(req.body.version),
      type : decrypt(req.body.type),
      url : decrypt(req.body.url),
    }, 
      {
        where : { idx : req.params.id }
      }).then(() => { 
        models.appverinfo.findAll()
        .then((results) => {
        var resultsArray = [];
        for(var i = 0 ; i < results.length ; i++){
            resultsArray.push({
                key : results[i].idx,
                updateVer : encrypt(results[i].version),
                updateType : encrypt(results[i].type),
                updateUrl : encrypt(results[i].url),
                bActivated : results[i].b_activated,
            })
          }
          res.json({ resultCode : successResultCode, message : successMessage, updateHistory : resultsArray})
        })
        .catch(err => {
          console.error(err);
          res.json({ resultCode : failedResultCode, message : failedMessage })
    });
  }).catch(err => {
    console.error(err);
    res.json({ resultCode : failedResultCode, message : failedMessage })
});
});


  /* DELETE appverinfo */
router.delete('/sp/appverinfos/:id', (req, res, next) =>{
  console.log('Delete Fc');
  models.appverinfo.destroy(
    {
      where : { idx : req.params.id}
    })
    .then(() => { 
        models.appverinfo.findAll()
        .then((results) => {
        var resultsArray = [];
        for(var i = 0 ; i < results.length ; i++){
            resultsArray.push({
                key : results[i].idx,
                updateVer : encrypt(results[i].version),
                updateType : encrypt(results[i].type),
                updateUrl : encrypt(results[i].url),
                bActivated : results[i].b_activated,
            })
          }
          res.json({ resultCode : successResultCode, message : successMessage, updateHistory : resultsArray})
        })
        .catch(err => {
          console.error(err);
          res.json({ resultCode : failedResultCode, message : failedMessage })
    });
  }).catch(err => {
    console.error(err);
    res.json({ resultCode : failedResultCode, message : failedMessage })
});
});

module.exports = router;

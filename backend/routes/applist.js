// 사용금지 목록 & 타 인강 목록
var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
const sequelize = require('sequelize');
var key = require("../config/cry");
const crypto = require('crypto');
const ivBuffer = ''
const Op = sequelize.Op;

var failedResultCode = 400;
var successResultCode = 200;

var successMessage = encrypt('success');
var failedMessage =  encrypt('failed');

// ================================================== Setting 사용 금지 & 허용 목록
/* GET users listing. */
router.get('/sp/disableapps', (req,res,next) => {
  models.applist.findAll({where : { b_disabled : true}})
    .then((results) => {
        var resultsArray = []
        for(var i = 0 ; i < results.length ; i++){
            resultsArray.push({
                idx : results[i].idx,
                id_app : encrypt(results[i].id_app),
                name_app : encrypt(results[i].name_app),
                b_ingang : results[i].b_ingang,
                b_disabled : results[i].b_disabled,
                b_browser : results[i].b_browser,
            })
        }
      res.json({ resultCode : successResultCode, message : successMessage, disableApps : resultsArray});
    })
    .catch(err => {
      res.json({ resultCode : failedResultCode, message : failedMessage});
    });
});

router.get('/sp/ableapps', (req,res,next) => {
    models.applist.findAll({where : {b_disabled : false}})
      .then((results) => {
        var resultsArray = []
        for(var i = 0 ; i < results.length ; i++){
            resultsArray.push({
                idx : results[i].idx,
                id_app : encrypt(results[i].id_app),
                name_app : encrypt(results[i].name_app),
                b_ingang : results[i].b_ingang,
                b_disabled : results[i].b_disabled,
                b_browser : results[i].b_browser,
            })
        }
        res.json({ resultCode : successResultCode, message : successMessage, ableApps : resultsArray});
      })
      .catch(err => {
        res.json({ resultCode : failedResultCode, message : failedMessage});
      });
  });


/* UPDATE User */

router.put('/sp/disableapps/:id', (req, res, next) => {
  models.applist.update(
    {
      id_app : decrypt(req.body.id_app),
      name_app : decrypt(req.body.name_app),
    }, 
      {
        where : { idx : req.params.id }
      }).then(results => { res.json({resultCode : successResultCode, message : successMessage, ableApps : results});
        
  }).catch(() => {
    res.json({ resultCode : failedResultCode, message : failedMessage});
  });

});

router.put('/sp/update/right/:id', (req, res, next) => {
  models.applist.update(
    {
      b_disabled : true
    }, 
      {
        where : { idx : req.params.id }
      }).then(users => { res.json(users);

  });

});

router.put('/sp/update/left/:id', (req, res, next) => {
  models.applist.update(
    {
      b_disabled : false
    }, 
      {
        where : { idx : req.params.id }
      }).then(users => { res.json(users);

  });

});

  /* DELETE User */
router.delete('/sp/delete/:id', (req, res, next) =>{
  console.log('Delete Fc');
  models.applist.destroy(
    {
      where : { idx : req.params.id}
    })
  .then(() => {
    models.applist.findAll({where : { b_disabled : true}})
    .then((results) => {
        var resultsArray = []
        for(var i = 0 ; i < results.length ; i++){
            resultsArray.push({
                idx : results[i].idx,
                id_app : encrypt(results[i].id_app),
                name_app : encrypt(results[i].name_app),
                b_ingang : results[i].b_ingang,
                b_disabled : results[i].b_disabled,
                b_browser : results[i].b_browser,
            })
        }
            res.json({ resultCode : successResultCode, message : successMessage, disableApps : resultsArray});
        })
    }).catch(() => {
        res.json({resultCode : failedResultCode, message : failedMessage});
    });
});

router.post('/sp/disableapps', (req, res, next) => {
  console.log(req.body);
  models.applist.create(
    {
      name_app : decrypt(req.body.name_app),
      id_app : decrypt(req.body.id_app),
      b_disabled : true
    }, 
    ).then(() => {
        models.applist.findAll({where : { b_disabled : true}})
        .then((results) => {
            var resultsArray = []
            for(var i = 0 ; i < results.length ; i++){
                resultsArray.push({
                    idx : results[i].idx,
                    id_app : encrypt(results[i].id_app),
                    name_app : encrypt(results[i].name_app),
                    b_ingang : results[i].b_ingang,
                    b_disabled : results[i].b_disabled,
                    b_browser : results[i].b_browser,
                })
            }
        res.json({ resultCode : successResultCode, message : successMessage, disableApps : resultsArray});
        })
  }).catch(() => {
    res.json({resultCode : failedResultCode, message : failedMessage});
  });

});



// =========================================== 타사 ingang

router.get('/sp/ingangs', (req,res,next) => {
    models.applist.findAll({where : {b_ingang : true}})
      .then((results) => {
          var resultsArray = [];
          for(var i = 0 ; i < results.length ; i++){
              resultsArray.push({
                  key : results[i].idx,
                  appId : encrypt(results[i].id_app),
                  appName : encrypt(results[i].name_app)
              })
          }
        res.json({resultCode : successResultCode, message : successMessage, ingangs : resultsArray});
      })
      .catch(() => {
        res.json({resultCode : failedResultCode, message : failedMessage});
      });
  });

router.delete('/sp/ingangs/:id', (req, res, next) =>{
  models.applist.destroy(
    {
      where : { idx : req.params.id}
    })
  .then(() => {
        models.applist.findAll({where : {b_ingang : true}})
        .then((results) => {
            var resultsArray = [];
            for(var i = 0 ; i < results.length ; i++){
                resultsArray.push({
                    key : results[i].idx,
                    appId : encrypt(results[i].id_app),
                    appName : encrypt(results[i].name_app)
                })
            }
            res.json({resultCode : successResultCode, message : successMessage, ingangs : resultsArray});
        })
        .catch(err => {
            res.json({resultCode : failedResultCode, message : failedMessage})
        });
  })
  .catch(() => {
    res.json({resultCode : failedResultCode, message : failedMessage});
  })
});

router.patch('/sp/ingangs/:id', (req, res, next) => {
  models.applist.update(
    {
        name_app : decrypt(req.body.name_app),
        id_app : decrypt(req.body.id_app),
    }, 
      {
        where : { idx : req.params.id }
      })
      .then(()=> { 
        models.applist.findAll({where : {b_ingang : true}})
        .then((results) => {
            var resultsArray = [];
            for(var i = 0 ; i < results.length ; i++){
                resultsArray.push({
                    key : results[i].idx,
                    appId : encrypt(results[i].id_app),
                    appName : encrypt(results[i].name_app)
                })
            }
            res.json({resultCode : successResultCode, message : successMessage, ingangs : resultsArray});
        })
        .catch(err => {
            res.json({resultCode : failedResultCode, message : failedMessage})
        });
  })
  .catch(() => {
    res.json({resultCode : failedResultCode, message : failedMessage})
  });

});

router.post('/sp/ingangs', (req, res, next) => {
  console.log(req.body);
  models.applist.create(
    {
      name_app : decrypt(req.body.name_app),
      id_app : decrypt(req.body.id_app),
      b_ingang : true
    })
    .then(()=> { 
        models.applist.findAll({where : {b_ingang : true}})
        .then((results) => {
            var resultsArray = [];
            for(var i = 0 ; i < results.length ; i++){
                resultsArray.push({
                    key : results[i].idx,
                    appId : encrypt(results[i].id_app),
                    appName : encrypt(results[i].name_app)
                })
            }
            res.json({resultCode : successResultCode, message : successMessage, ingangs : resultsArray});
        })
        .catch(err => {
            res.json({resultCode : failedResultCode, message : failedMessage})
        });
  })
  .catch(() => {
    res.json({resultCode : failedResultCode, message : failedMessage})
  });

});

module.exports = router;

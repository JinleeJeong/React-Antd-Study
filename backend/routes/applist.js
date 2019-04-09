var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
const sequelize = require('sequelize');

var failedMessage = 'failed';
var failedResultCode = 414;
var successMessage = 'success';
var successResultCode = 200;

// ================================================== 전체 앱별 사용이력
router.get('/sp/all', (req,res,next) => {
  models.applist.findAll()
    .then((results) => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});

// =========================================== 인강별 ( b_ingang true && false)
router.get('/sp/ingangs/all', (req,res,next) => {
  models.applist.findAll({where : {b_ingang : {ne : null}}})
    .then((results) => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});


// ================================================== Setting 사용 금지 & 허용 목록
/* GET users listing. */
router.get('/sp/disableapps', (req,res,next) => {
  models.applist.findAll({where : { b_disabled : true}})
    .then((results) => {
      res.json({ resultCode : successResultCode, message : successMessage, disableApps : results});
    })
    .catch(err => {
      res.json({ resultCode : failedResultCode, message : failedMessage});
    });
});

router.get('/sp/ableapps', (req,res,next) => {
    models.applist.findAll({where : {b_disabled : false}})
      .then((results) => {
        res.json({ resultCode : successResultCode, message : successMessage, ableApps : results});
      })
      .catch(err => {
        res.json({ resultCode : failedResultCode, message : failedMessage});
      });
  });


/* UPDATE User */

router.put('/sp/disableapps/:id', (req, res, next) => {
  models.applist.update(
    {
      id_app : req.body.id_app,
      name_app : req.body.name_app,
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
  .then(users => {
     res.json(users);
  })
});

router.post('/sp/disableapps/insert', (req, res, next) => {
  console.log(req.body);
  models.applist.create(
    {
      name_app : req.body.name_app,
      id_app : req.body.id_app,
      b_disabled : true
    }, 
    ).then(applist => { res.json(applist);
        
  }).catch(() => {
    res.send("Error");
  });

});



// =========================================== 타사 ingang

router.get('/sp/ingangs', (req,res,next) => {
  models.applist.findAll({where : { b_ingang : true}})
    .then((results) => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});

router.delete('/sp/ingangs/delete/:id', (req, res, next) =>{
  models.applist.destroy(
    {
      where : { idx : req.params.id}
    })
  .then(users => {
     res.json(users);
  })
});

router.put('/sp/ingangs/update/:id', (req, res, next) => {
  models.applist.update(
    {
      id_app : req.body.id_app,
      name_app : req.body.name_app,
    }, 
      {
        where : { idx : req.params.id }
      }).then(applist => { res.json(applist);
        
  }).catch(() => {
    res.send("Error");
  });

});

router.post('/sp/ingangs/insert', (req, res, next) => {
  console.log(req.body);
  models.applist.create(
    {
      name_app : req.body.name_app,
      id_app : req.body.id_app,
      b_ingang : true
    }, 
    ).then(applist => { res.json(applist);
        
  }).catch(() => {
    res.send("Error");
  });

});

module.exports = router;

var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

/* GET users listing. */
router.get('/sp/appverinfos', (req,res,next) => {
  models.appverinfo.findAll()
    .then((results) => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});

router.post('/sp/appverinfos/insert', (req, res, next) => {
  models.appverinfo.create(
    {
      version : req.body.version,
      type : req.body.type,
      url : req.body.url,
    }, 
    ).then(appverinfo => { res.json(appverinfo);
        
  }).catch(() => {
    res.send("Error");
  });
});

/* UPDATE appverinfo */

router.put('/sp/appverinfos/update/:id', (req, res, next) => {
  models.appverinfo.update(
    {
      version : req.body.version,
      type : req.body.type,
      url : req.body.url,
    }, 
      {
        where : { idx : req.params.id }
      }).then(users => { res.json(users);
  });
});


  /* DELETE appverinfo */
router.delete('/sp/appverinfos/delete/:id', (req, res, next) =>{
  console.log('Delete Fc');
  models.appverinfo.destroy(
    {
      where : { idx : req.params.id}
    })
  .then(users => {
     res.json(users);
  })
});

module.exports = router;

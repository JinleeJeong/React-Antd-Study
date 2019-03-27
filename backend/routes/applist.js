var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

// models.applist.create({id_app: 'ID 9', name_app: 'Nine', b_disabled : true})
// .then(result => {
//    res.json(result);
// })
// .catch(err => {
//    console.error(err);
// });
/* GET users listing. */
router.get('/true', (req,res,next) => {
  models.applist.findAll({where : { b_disabled : true}})
    .then((results) => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});

router.get('/false', (req,res,next) => {
    models.applist.findAll({where : { b_disabled : false}})
      .then((results) => {
        res.json(results);
      })
      .catch(err => {
        console.error(err);
      });
  });


// /* UPDATE User */

router.put('/update/:id', (req, res, next) => {
  models.applist.update(
    {
      id_app : req.body.id_app,
      name_app : req.body.name_app,
    }, 
      {
        where : { idx : req.params.id }
      }).then(users => { res.json(users);
        
  }).catch(() => {
    res.send("Error");
  });

});

router.put('/update/right/:id', (req, res, next) => {
  models.applist.update(
    {
      disabled : false
    }, 
      {
        where : { idx : req.params.id }
      }).then(users => { res.json(users);

  });

});

router.put('/update/left/:id', (req, res, next) => {
  models.applist.update(
    {
      disabled : true
    }, 
      {
        where : { idx : req.params.id }
      }).then(users => { res.json(users);

  });

});


  /* DELETE User */
router.delete('/delete/:id', (req, res, next) =>{
  console.log('Delete Fc');
  models.applist.destroy(
    {
      where : { idx : req.params.id}
    })
  .then(users => {
     res.json(users);
  })
});



module.exports = router;

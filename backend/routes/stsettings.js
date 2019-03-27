var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

/* GET users listing. */
router.get('/', (req,res,next) => {
  models.stsettings.findAll()
    .then((results) => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});

  // models.stsettings.create({Name: '홍씨', App: '9', Amount : 10, Teacher : "김백준"})
  //   .then(result => {
  //      res.json(result);
  //   })
  //   .catch(err => {
  //      console.error(err);
  // });
/* UPDATE stsettings */

router.put('/update/:id', (req, res, next) => {
  models.stsettings.update(
    {
      Name : req.body.Name,
      App : req.body.App,
      Amount : req.body.Amount,
    }, 
      {
        where : { key : req.params.id }
      }).then(users => { res.json(users);
  });
});


  /* DELETE stsettings */
router.delete('/delete/:id', (req, res, next) =>{
  console.log('Delete Fc');
  models.stsettings.destroy(
    {
      where : { key : req.params.id}
    })
  .then(users => {
     res.json(users);
  })
});

  // models.stsettings.update({password: '새로운 유저PW'}, {where: {userID: '유저ID'}})
  // .then(result => {
  //    res.json(result);
  // })
  // .catch(err => {
  //    console.error(err);
  // });



/* GET SINGLE stsettings BY ID */
router.get('/:id', function(req, res, next) {
  stsettings.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE stsettings */
// router.post('/', function(req, res, next) {
//   stsettings.create(req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });




module.exports = router;

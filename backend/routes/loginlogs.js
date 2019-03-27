var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

/* GET users listing. */
router.get('/', (req,res,next) => {
  models.loginlogs.findAll()
    .then((results) => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});

  // models.loginlogs.create({Name: '홍씨', App: '9', Amount : 10, Teacher : "김백준"})
  //   .then(result => {
  //      res.json(result);
  //   })
  //   .catch(err => {
  //      console.error(err);
  // });
/* UPDATE loginlogs */

router.put('/update/:id', (req, res, next) => {
  models.loginlogs.update(
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


  /* DELETE loginlogs */
router.delete('/delete/:id', (req, res, next) =>{
  console.log('Delete Fc');
  models.loginlogs.destroy(
    {
      where : { key : req.params.id}
    })
  .then(users => {
     res.json(users);
  })
});

  // models.loginlogs.update({password: '새로운 유저PW'}, {where: {userID: '유저ID'}})
  // .then(result => {
  //    res.json(result);
  // })
  // .catch(err => {
  //    console.error(err);
  // });



/* GET SINGLE loginlogs BY ID */
router.get('/:id', function(req, res, next) {
  loginlogs.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE loginlogs */
// router.post('/', function(req, res, next) {
//   loginlogs.create(req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });




module.exports = router;

var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

/* GET users listing. */
router.get('/', (req,res,next) => {
  models.branches.findAll()
    .then((results) => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});

  // models.branches.create({Name: '홍씨', App: '9', Amount : 10, Teacher : "김백준"})
  //   .then(result => {
  //      res.json(result);
  //   })
  //   .catch(err => {
  //      console.error(err);
  // });
/* UPDATE branches */

router.put('/update/:id', (req, res, next) => {
  models.branches.update(
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


  /* DELETE branches */
router.delete('/delete/:id', (req, res, next) =>{
  console.log('Delete Fc');
  models.branches.destroy(
    {
      where : { key : req.params.id}
    })
  .then(users => {
     res.json(users);
  })
});

  // models.branches.update({password: '새로운 유저PW'}, {where: {userID: '유저ID'}})
  // .then(result => {
  //    res.json(result);
  // })
  // .catch(err => {
  //    console.error(err);
  // });



/* GET SINGLE branches BY ID */
router.get('/:id', function(req, res, next) {
  branches.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE branches */
// router.post('/', function(req, res, next) {
//   branches.create(req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });




module.exports = router;

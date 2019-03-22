var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

/* GET users listing. */
// router.get('/', (req,res,next) => {
//   models.Board.findAll()
//     .then((results) => {
//       console.log(results);
//       res.json(results);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });
  // models.Board.create({Name: '푸씨', App: '9'})
  //   .then(result => {
  //      res.json(result);
  //   })
  //   .catch(err => {
  //      console.error(err);
  // });

  // models.Board.update({password: '새로운 유저PW'}, {where: {userID: '유저ID'}})
  // .then(result => {
  //    res.json(result);
  // })
  // .catch(err => {
  //    console.error(err);
  // });

  // models.Board.destroy({where: {userID: '유저ID'}})
  // .then(result => {
  //    res.json({});
  // })
  // .catch(err => {
  //    console.error(err);
  // });


/* GET SINGLE Board BY ID */
router.get('/:id', function(req, res, next) {
    Board.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE Board */
router.post('/', function(req, res, next) {
    Board.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE Board */
router.put('/:id', function(req, res, next) {
  Board.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE Board */
router.delete('/:id', function(req, res, next) {
  Board.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;

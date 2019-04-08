var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
var jwt = require('jsonwebtoken');
var secretObj = require('../config/jwt');

/* GET users listing. */
// router.get('/', (req,res,next) => {
//   models.teachers.findAll()
//     .then((results) => {
//       res.json(results);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });

// models.teachers.create({id_tc: '60St', ip_tc: '50St', token_tc : '100St', name_tc : "50St"})
//   .then(result => {
//     res.json(result);
//   })
//   .catch(err => {
//     console.error(err);
//   });
/* UPDATE teachers */

router.put('/update/:id', (req, res, next) => {
  models.teachers.update(
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


module.exports = router;

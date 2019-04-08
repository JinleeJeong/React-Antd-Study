var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

/* GET users listing. */
// router.get('/', (req,res,next) => {
//   models.loginlogs.findAll()
//     .then((results) => {
//       res.json(results);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });

  // models.loginlogs.create({idx: 'St', id_login: 'St'})
  //   .then(result => {
  //      res.json(result);
  //   })
  //   .catch(err => {
  //      console.error(err);
  // });


module.exports = router;

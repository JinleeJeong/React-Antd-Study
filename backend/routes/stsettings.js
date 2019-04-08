var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

/* GET users listing. */
// router.get('/', (req,res,next) => {
//   models.stsettings.findAll()
//     .then((results) => {
//       res.json(results);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });

// models.stsettings.create({id_st: '50St', id_tc: '50St', devicename : 'St50', os : "St50", 
//                           ip_st: 'St50', ip_tc: 'St50', b_lockscreen : false, resolution : "St50", 
//                             // b_thumb_ad: '홍씨', b_thumb_tc: '9'
//                           })
//     .then(result => {
//        res.json(result);
//     })
//     .catch(err => {
//        console.error(err);
//   });


module.exports = router;

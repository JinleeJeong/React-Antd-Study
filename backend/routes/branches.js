var express = require('express');
var router = express.Router();
var models = require("../models/index.js");


/* GET users listing. */
// router.get('/', (req,res,next) => {
//   models.branches.findAll()
//     .then((results) => {
//       res.json(results);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });
/* UPDATE branches */

//   models.branches.create({id_br: '60St', name_br: '100St', token_br : '100St', ip_br : "50St", colorbit : 1, fps : 1, 
//   // b_blockbrowser : '', b_blockotherapps : '', b_blockremove : '', b_blockforcestop : ''
// })
//     .then(result => {
//        res.json(result);
//     })
//     .catch(err => {
//        console.error(err);
//   });
module.exports = router;

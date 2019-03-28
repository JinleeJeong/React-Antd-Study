var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

/* GET users listing. */
router.get('/all', (req,res,next) => {
  models.stlogs.findAll()
    .then((results) => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});
// models.stlogs.create({
//                       id_st : '6번', 
//                       id_tc : '6.1번', 
//                       id_app : '6.2번', 
//                       name_app : '바씨',  
//                       starttime : '2019-03-10 07:05:02',  
//                       endtime : '2019-03-13 16:05:02'
//                     })
//   .then(result => {
//      res.json(result);
//   })
//   .catch(err => {
//      console.error(err);
// });
/* UPDATE stlogs */

router.put('/update/:id', (req, res, next) => {
  models.stlogs.update(
    {
      name_app : req.body.name_app,
      id_app : req.body.App,
      starttime : req.body.starttime,
    }, 
      {
        where : { idx : req.params.id }
      }).then(users => { res.json(users);
  });
});


  /* DELETE stlogs */
router.delete('/delete/:id', (req, res, next) =>{
  console.log('Delete Fc');
  models.stlogs.destroy(
    {
      where : { idx : req.params.id}
    })
  .then(users => {
     res.json(users);
  })
});




module.exports = router;

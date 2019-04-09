var express = require('express');
var router = express.Router();
var models = require("../models/index.js");

/* GET users listing. */
router.get('/sp/stusg', (req,res,next) => {
  models.stlogs.findAll()
    .then((results) => {
      models.stlogs.find({
        include : [{model : models.students, where : {id_st : "50St"}}]
      })
      .then( result2 => {
        console.log('number2', result2);
      })
      console.log('number1', results);
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
//                       starttime : '2019-04-04 07:05:02',  
//                       endtime : '2019-04-07 16:05:02'
//                     })
//   .then(result => {
//      res.json(result);
//   })
//   .catch(err => {
//      console.error(err);
// });
/* UPDATE stlogs */

router.put('/sp/members/:id', (req, res, next) => {
  models.stlogs.update(
    {
      id_st : req.body.id_st,
      id_tc : req.body.id_tc,
      name_app : req.body.name_app,
      id_app : req.body.id_app,
      starttime : req.body.startTime,
    }, 
      {
        where : { idx : req.params.id }
      }).then(users => { res.json(users);
  });
});


router.delete('/sp/stusg/delete/:id', (req, res, next) =>{
  models.stlogs.destroy(
    {
      where : { idx : req.params.id}
    })
  .then(users => {
     res.json(users);
  })
});

module.exports = router;

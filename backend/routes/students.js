var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
var sequelize = require('sequelize')
/* GET users listing. */
router.get('/students', (req,res,next) => {
  models.students.findAll({include : [
    {
      model : models.teachers, 
      where : sequelize.where(
      sequelize.col('students.id_tc'),
      sequelize.col('teacher.id_tc'),
    )},
    {
      model : models.branches,
      where : sequelize.where(
      sequelize.col('students.id_br'),
      sequelize.col('branch.id_br'),
    )
    },
    {
      model : models.stsettings,
      where : sequelize.where(
      sequelize.col('students.id_st'),
      sequelize.col('stsettings.id_st'),
    )
    },
    {
      model : models.stlogs,
      where : sequelize.where(
      sequelize.col('students.id_st'),
      sequelize.col('stlogs.id_st'),
    )
    },




  ] 
  })
    .then((results) => {
      res.json(results);
    })
    .catch(err => {
      console.error(err);
    });
});

// models.students.create({id_st: '60St', name_st: '50St', id_tc : '50St', id_br : "50St", token_st : "100St"})
//   .then(result => {
//      res.json(result);
//   })
//   .catch(err => {
//      console.error(err);
// });
/* UPDATE students */

router.put('/update/:id', (req, res, next) => {
  models.students.update(
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


  /* DELETE students */
router.delete('/delete/:id', (req, res, next) =>{
  console.log('Delete Fc');
  models.students.destroy(
    {
      where : { key : req.params.id}
    })
  .then(users => {
     res.json(users);
  })
});




module.exports = router;

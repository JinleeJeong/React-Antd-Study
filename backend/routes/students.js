var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
var sequelize = require('sequelize')
/* GET users listing. */
router.get('/sp/students', (req,res,next) => {
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
      models.applist.findAll({where : {b_disabled : false}})
      .then((applist) => {
        console.log('students Routes', results[0].branch.id_br);
        res.json({result : results, applist : applist, setting : { b : results[0].branch.id_br, c : results[0].branch.id_br}});
      })

    })
    .catch(err => {
      console.error(err);
    });



});

/* UPDATE students */

router.put('/sp/update/:id', (req, res, next) => {
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
router.delete('/sp/delete/', (req, res, next) =>{
  console.log('Delete Fc');
  models.students.destroy(
    {
      where : { id_st : "테스팅"}
    })
  .then(users => {
     res.json(users);
  })
});




module.exports = router;

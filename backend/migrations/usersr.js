// var express = require('express');
// var router = express.Router();
// var models = require("../models/index.js");

// /* GET users listing. */
// router.get('/', (req,res,next) => {
//   models.User.findAll()
//     .then((results) => {
//       res.json(results);
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });

//   // models.User.create({Name: '홍씨', App: '9', Amount : 10, Teacher : "김백준"})
//   //   .then(result => {
//   //      res.json(result);
//   //   })
//   //   .catch(err => {
//   //      console.error(err);
//   // });
// /* UPDATE User */

// router.put('/update/:id', (req, res, next) => {
//   models.User.update(
//     {
//       Name : req.body.Name,
//       App : req.body.App,
//       Amount : req.body.Amount,
//     }, 
//       {
//         where : { key : req.params.id }
//       }).then(users => { res.json(users);
//   });
// });


//   /* DELETE User */
// router.delete('/delete/:id', (req, res, next) =>{
//   console.log('Delete Fc');
//   models.User.destroy(
//     {
//       where : { key : req.params.id}
//     })
//   .then(users => {
//      res.json(users);
//   })
// });

//   // models.User.update({password: '새로운 유저PW'}, {where: {userID: '유저ID'}})
//   // .then(result => {
//   //    res.json(result);
//   // })
//   // .catch(err => {
//   //    console.error(err);
//   // });



// /* GET SINGLE User BY ID */
// router.get('/:id', function(req, res, next) {
//   User.findById(req.params.id, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

// /* SAVE User */
// // router.post('/', function(req, res, next) {
// //   User.create(req.body, function (err, post) {
// //     if (err) return next(err);
// //     res.json(post);
// //   });
// // });




// module.exports = router;

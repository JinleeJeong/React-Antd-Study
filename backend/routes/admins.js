var express = require('express');
var router = express.Router();
var models = require("../models/index");
var jwt = require('jsonwebtoken');
var secretObj = require('../config/jwt');


router.post('/login', function(req, res, next) {
    var failed = 'failed';
    const token = jwt.sign({ 
        id_ad : req.body.id_ad //payload(토큰 내용)
     }, secretObj.secret, //비밀키
    { 
        expiresIn: '1m'  // 유효시간
    })
    models.admins.findOne({ where: { id_ad : req.body.id_ad } }) 
    .then((admin) => {
        if(admin.idx === 1)
        {
            admin.update({token_ad : token})
            res.cookie('admin', token); 
            res.json({ token: token, admins : admin })
            console.log("token_ad Store : " ,admin.token_ad)
        } 
        else {
            res.send(failed)
        }
    }).catch(err => {
        res.send(failed);
    })
    }
);


router.get('/logout', (req,res,next) => {
    models.admins.findOne({where : { idx : 1}})
      .then((admin) => {
          admin.update({token_ad : ''})
        res.json(admin, 'reback');
      })
      .catch(err => {
        console.error(err);
      });
  });
  
router.get('/someAPI', (req,res,next) => {
    let token = req.cookies.admin; 
    let decoded = jwt.verify(token, secretObj.secret);
    let success = 'success';
    let failed = 'failed';
    if(decoded)
    { 
        res.send(success) 
    } 
    else
    {
         res.send(failed) 
    }
});

// models.admins.create({idx: '1', id_ad : 'tech'})
//     .then(result => {
//        res.json(result);
//     })
//     .catch(err => {
//        console.error(err);
//   });
module.exports = router;

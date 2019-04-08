var express = require('express');
var router = express.Router();
var models = require("../models/index");
var jwt = require('jsonwebtoken');
var secretObj = require('../config/jwt');

var failedMessage = 'failed';
var failedResultCode = 414;
var successMessage = 'success';
var successResultCode = 200;
var checkAuthor;
router.post('/login', function(req, res, next) {
    
    const token = jwt.sign({ 
        id_ad : req.body.id_ad //payload(토큰 내용)
     }, secretObj.secret, //비밀키
    { 
        expiresIn: '1m'  // 유효시간
    })

    models.admins.findOne({ where: { id_ad : req.body.id_ad } }) 
    .then((admin) => {
            console.log('Admin : ');
            admin.update({token_ad : token}, {httpOnly: true})
            res.json({ resultCode : successResultCode, message : successMessage, userName : admin.name_ad})
            checkAuthor=admin.token_ad;
    })

    models.branches.findOne({ where: { id_br : req.body.id_ad } }) 
    .then((branch) => {
            console.log('branch : ');
            branch.update({token_br : token}, {httpOnly: true})
            res.json({ resultCode : successResultCode, message : successMessage, userName : branch.name_br})
            checkAuthor=branch.token_br;
    })
        
    models.teachers.findOne({ where: { id_tc : req.body.id_ad } }) 
    .then((teacher) => {
            console.log('teacher : ');
            teacher.update({token_tc : token}, {httpOnly: true})
            res.json({ resultCode : successResultCode, message : successMessage, userName : teacher.name_tc})
            checkAuthor=teacher.token_tc;
            
        }).catch(() => {
        res.json({ resultCode : failedResultCode, message : failedMessage})
    })  
    setTimeout(() =>{
        console.log(checkAuthor)}, 3000);
});
// password, os, ip 들어옴


router.post('/logout', (req,res,next) => {

    if(req.body.author === 'admin') {
        models.admins.update({ token_ad : '' }, {where : { token_ad : {ne : null}}})
      .then(() => {
        res.json({resultCode : successResultCode, message : successMessage});
        })
    } else if(req.body.author.includes('branches')) {
        models.branches.update({ token_br : '' },{where : { token_br : {ne : null}}})
        .then(() => {
        res.json({resultCode : successResultCode, message : successMessage});
        })
    } else if(req.body.author.includes('teachers')) {
        models.teachers.update({ token_tc : '' }, {where : { token_tc : {ne : null}}})
        .then(() => {
        res.json({resultCode : successResultCode, message : successMessage});
        })
    } else {
        res.json({resultCode : failedResultCode, message : failedMessage});
    }
  });  
// password, os, ip 들어옴

router.get('/check', (req,res,next) => {
    let success = 'success!!';
    let failed = 'failed!!';

        models.admins.findOne({ where: { token_ad : checkAuthor}}) 
        .then((admin) => {
            console.log('Admin Exist');
            res.json({ resultCode : successResultCode, message : successMessage, confirm : success, userName : admin.name_ad})
        })
    

        models.branches.findOne({ where: { token_br : checkAuthor}}) 
        .then((branch) => {
            console.log('branch Exist');
            res.json({ resultCode : successResultCode, message : successMessage, confirm : success, userName : branch.name_br})
        })

        models.teachers.findOne({ where: { token_tc : checkAuthor}}) 
        .then((teacher) => {
            console.log('teacher Exist');
            res.json({ resultCode : successResultCode, message : successMessage, confirm : success, userName : teacher.name_tc})
        })


    
});

module.exports = router;

var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
const crypto = require('crypto');

  router.get('/pc/ltest', (req,res, next) => {
    
    var userid = "M";
    var os = "Teacher3";
    var osver = "http://10.211.55.7:3200/api/scrimg-upload"
    var ip = "0020"
    

    var hw = encrypt(userid,key);
    var hw1 = encrypt(os,key);
    var hw2 = encrypt(osver,key);
    var hw3 = encrypt(ip,key);

    console.log("################### 인코딩 ##################");
    console.log(hw, "과");
    console.log(hw1, "과");
    console.log(hw2, "과");
    console.log(hw3, "과");
    // console.log("################### 디코딩 ##################");
    // console.log(decrypt("A0qJ03MCGcrj3JiAm6lzOA==",key));
})


router.delete('/pc/ltest/delete', (req,res,next) => {
  models.loginlogs.destroy({where : {idx : "St"}})
  .then(() => {
    res.json("success");
  })
})

module.exports = router;

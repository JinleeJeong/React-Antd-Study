var express = require('express');
var router = express.Router();
var models = require("../models/index.js");
const crypto = require('crypto');
var key = '';

function encrypt(text,key){

     var cipher = crypto.createCipher('aes-256-cbc',key); 
     var encipheredContent = cipher.update(text,'utf8','base64'); 
     encipheredContent += cipher.final('base64');
 
     return encipheredContent;
 }
 /* 암호화에서 문자열 16자 이하면, update는 null값을 가진다. 
  항상 update + final 형식으로 암호화를 해야한다.
 *** Key값은 클라이언트에 노출되지 않도록 한다. *** */
function decrypt(text,key){

  var decipher = crypto.createDecipher('aes-256-cbc',key);
  var decipheredPlaintext = decipher.update(text, 'base64', 'utf8');
  decipheredPlaintext += decipher.final('utf8');

  return decipheredPlaintext;
}
  router.get('/pc/ltest', (req,res, next) => {
    
    var userid = "M";
    var os = "Coek else";
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

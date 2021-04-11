const express = require('express');
const { fstat } = require('fs');
const router=express.Router();
const path = require('path');
const rootDir=require('../util/path');
const fs = require('fs');
const admin = require('./admin');

router.use('/',(req,res,next)=>{
    res.sendFile(path.join(rootDir,'views','shop.html'));
    console.log(admin.products);
    
// code here

});

module.exports=router;

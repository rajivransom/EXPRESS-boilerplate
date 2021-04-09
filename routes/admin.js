const express = require('express');
const fs = require('fs');
const router=express.Router();
const path = require('path');
const rootDir = require('../util/path');

router.get('/add-product',(req,res,next)=>{
    res.sendFile(path.join(rootDir,'views','add-product.html'));
    
    
// code here

});


module.exports=router;
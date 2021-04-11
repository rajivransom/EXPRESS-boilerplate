const express = require('express');
const fs = require('fs');
const router=express.Router();
const path = require('path');
const rootDir = require('../util/path');
const products=[];

router.get('/add-product',(req,res,next)=>{
    res.sendFile(path.join(rootDir,'views','add-product.html'));
    
    console.log(req.body);
    
    
// code here

});
router.post('/add-product',(req,res,next)=>{
    
    products.push({title:req.body.title});
    console.log(products);
    res.redirect('/');
// code here

})

exports.routes=router;
exports.products=products;
const express = require('express');

const app=express();
const bodyParser = require('body-Parser');
const http = require('http');
const admin = require('./routes/admin');
const shop = require('./routes/shop');
const path = require('path');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(admin);
app.use(shop);






app.listen(3000);
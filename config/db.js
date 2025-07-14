const express = require('express');
const app = express();
const mongoose = require('mongoose');

const dataBase = mongoose.connect("mongodb+srv://Manish:khare@cluster0.gpi036a.mongodb.net/")
    .then(() => {
        console.log('connected to mongo Altas')
    }).catch(err => {
        console.log(err);
     }
    )  

module.export = { dataBase };
    
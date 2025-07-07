const express = require('express');
const app = express();
const mongoose = require('mongoose');

 const url = "mongodb+srv://Manish:khare@cluster0.gpi036a.mongodb.net/e-shop?retryWrites=true&w=majority";
 const dataBase = mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });  

module.export = { dataBase };
    
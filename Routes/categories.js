const express = require('express');
const categoriesRoute = express.Router();
const mongoose = require('mongoose'); 
const category = require('../modals/category')
 
categoriesRoute.get('/', async (req, res) => {
    const Categories = await category.find();
      res.send({
         data:Categories
          })
  }) 
  categoriesRoute.post('/Category', async (req, res) => {
       const Categories = new category({
        name:"Men"
       
      })  
       await Categories.save();
       res.json({
          data: req.body
        }) 
       
     
  }) 
   
 
module.exports = categoriesRoute;
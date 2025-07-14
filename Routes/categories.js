const express = require('express');
const categoriesRoute = express.Router();
const mongoose = require('mongoose'); 
const category = require('../modals/category')
 
categoriesRoute.get('/women', async (req, res) => {
    const Categories = await category.find();
      res.send({
         data:Categories
          })
  }) 
  categoriesRoute.post('/womenCount', async (req, res) => {
       const Categories = new category({
          name:req.body.name,
          price:req.body.price,
          brand:req.body.brand,
          actualPrice: req.body.actualPrice,
          size:req.body.size,
      })  
       await Categories.save();
       res.json({
          data: req.body
        }) 
       
      console.log(Categories);
  }) 
   
 
module.exports = categoriesRoute;
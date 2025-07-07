const express = require('express');
const isAdminRoute = express.Router();
const mongoose = require('mongoose'); 
const user = require('../modals/user');
const admin = require('../modals/admin');
const bcrypt = require('bcrypt');



isAdminRoute.post('/admin-register', async (req, res) => { 
    try {
        
      const password = await bcrypt.hashSync(req.body.password, 10); 
    
      const Admin = new user({
         name:req.body.name,
         phone:req.body.phone,
         email:req.body.email,
         passwordHash: password,
         isAdmin:req.body.isAdmin,
         apartment: req.body.apartment,
         city: req.body.city,
         zip: req.body.zip,
         street:req.body.street,
         country: req.body.country,
           
     })  
      await Admin.save();
      res.status(200).json({
         data:Admin
       }) 
      
     console.log(Admin);
  
    } catch (error) {
        console.error("Error :",error)
      }
    
})    
    
module.exports = { isAdminRoute};
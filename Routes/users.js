const express = require('express');
const usersRoute = express.Router();
const mongoose = require('mongoose'); 
const user = require('../modals/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

usersRoute.post('/registeration', async(req, res) => { 
  try {
      
    const password = await bcrypt.hashSync(req.body.password, 10); 
  
    const Users = new user({
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
    await Users.save();
    res.status(200).json({
       data:Users
     }) 
    
   console.log(Users);

  } catch (error) {
      console.error("Error :",error)
    }
  
  })   
    
    usersRoute.post('/login', async (req, res) => {
      const userDetail = await user.findOne({ email: req.body.email });
      console.log(userDetail.passwordHash)
      const secret = "mykey";
      const isValidPassword = await bcrypt.compareSync(req.body.password, userDetail.passwordHash)  
       console.log(userDetail)
      const token = jwt.sign(
        {
          id: userDetail._id,
          email: userDetail.email,
          isAdmin: userDetail.isAdmin || false
        },
        secret,
        { expiresIn: '1d' }
      ); 
      if (!userDetail) {
        res.status(404).send("User not Found")
      } if (!isValidPassword) {
        res.status(401).send("Invailid password")
      } 
      console.log(userDetail && isValidPassword)
      if(userDetail && isValidPassword)
        res.status(200).json({
          message:"Login Successfull !!",
          jwt: token,
          data: userDetail
          }
            )
    }) 
usersRoute.delete("/delete/:id", (req, res) => {
  user.findByIdAndRemove(req.params.id).then((user) => {
    if (user) {
      res.status(200).send({
        success: true,
        message:"user deleted successfully !!"
      })
     }else {
      res.status(404).send("user not found")
     }
  }).catch(err=>{
    console.error(err);
  })
    
})
  
    usersRoute.put("/put/:id", async(req, res) => {
      userExist = await user.findById(req.params.id);
      if (req.body.password) {
        let newPassword = bcrypt.hashSync(req.req.password, 10);
      } else {
        newPassword = userExist.passwordHash;
      }
    
      user.findByIdAndUpdate(req.params.id, {

        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
          
      },
      {new:true} )
      if (!userExist) {
         res.status(404).send("User not Found")
      } 
      res.send(user); 
    }) 
 
     
usersRoute.get("/count", async (req,res) => { 
     
  const userCount =await user.countDocuments();
  if (!userCount) {
   return res.status(500).send("internal server error");

  } else {
    return res.status(201).send({userCount:userCount})
  }
   
 })
    
 module.exports = usersRoute;
        
    
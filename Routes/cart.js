const express = require('express');
const Product = require('../modals/product');
const { default: mongoose } = require('mongoose');
const Cart = require('../modals/cartItems');
const cartRoute = express.Router();


cartRoute.post('/add', async (req, res) => { 
   
    const { product, quantity, size } = req.body;
     
    try {
        if (!mongoose.Types.ObjectId.isValid(req.body.product)) {
            res.status(400).json({
                message: 'invalid Product ID !!'
            })
        }
        const foundProduct = await Product.findById(req.body.product); 

        if (!foundProduct) {
           return res.status(404).json({
                message:"Product Not Found"
            })
        }   
        const userId = req.auth?.id;
        if (!userId) {
         
          return res.status(401).json({ message: 'Unauthorized' });
        }
        let cart = await Cart.findOne({ user:userId }); 

        if (!cart) {
            cart = new Cart({
                user:userId,
                items: [{ product, quantity, size }]
          })
            
        } 
        const itemIndex = cart.items.findIndex(
            (i) => i.product.toString() === product
        ) 
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity
        } else {
            cart.items.push({ product, quantity, size });
        } 
        const savedCart = await cart.save();
        res.json(savedCart);
 
} catch (error) {
        res.status(500).json({error})
}
}) 

cartRoute.get('/get', async (req, res) => {
       
    try { 
        const userId = req.auth?.id;
       
        if (!userId){
            return res.status(401).json({
             message:"Unauthorized"
         })   
        }  
        const cart = await Cart.findOne({ user: userId }).populate('items.product')
        
        if (!cart) {
            return res.json({ items: [] });
        } 
        else {
           return res.status(200).json(cart);
        }
        

           
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: false,
            Error:error
        })
    }
     
 })




module.exports = { cartRoute }
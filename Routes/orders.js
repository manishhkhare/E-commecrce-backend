const express = require('express');
const ordersRoute = express.Router();
const mongoose = require('mongoose'); 
const order = require('../modals/order')
const Razorpay = require('razorpay');
const crypto = require('crypto');



const { OrderItem } = require('../modals/orderItems');

ordersRoute.get('/', async (req, res) => {
  const ordersList = await order.find().populate('user', 'name').populate({
    path: 'orderItems',
    populate: {
      path: 'product',
      model: 'productSchema'
    }
  })
  if (!ordersList) {
      
    res.status(500).send({
      success:false,
      message:"Internal Server Error !!"})
  } else {
    res.status(200).json({
      orders:ordersList
    })
  }

  
})  
  
ordersRoute.get("/:id", async (req, res) => {
  const orders = await order.findById().populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: { path: 'orders', populate: 'category' }
    });
  if (!orders) {
    res.status(500).send({
      message: "Internal Server Error",
      success:false
    })
  }
  else {
    res.status(201).json({
      order:order
    })
  }

}) 
 
 // Razorpay Instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_IWc5S3RoO1MUeC', // Replace with your Razorpay Key ID
  key_secret: 'er445VEHW7bB8hbO6yWliyMN' // Replace with your Razorpay Key Secret
});

// Create Razorpay order
ordersRoute.post('/payment/order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: 'INR',
      receipt: 'receipt_order_' + Date.now()
    };
    const order = await razorpay.orders.create(options);
    console.log("orderd:",order)
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
  }
});

// Verify Razorpay Payment
ordersRoute.post('/payment/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(sign.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature sent!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

ordersRoute.post('/create', async (req, res) => {
  try {
    // 1. Save OrderItems and get their IDs
    console.log(req.body.items)
    const orderItemsIds = await Promise.all(
      req.body.items.map(async (item) => {
        const newOrderItem = new OrderItem({
          quantity: item.quantity,
          product: item.product
        });
        const savedOrderItem = await newOrderItem.save();
        return savedOrderItem._id;
      })
    );

    // 2. Calculate total price
    const totalPrices = await Promise.all(
      orderItemsIds.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    // 3. Create the order
    const newOrder = new order({
      orderItems: orderItemsIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.auth.id
    });

    const savedOrder = await newOrder.save();

    if (!savedOrder) {
      return res.status(400).json({ message: 'order cannot be created!' });
    }

    res.status(201).json(savedOrder);
    console.log(savedOrder);
  } catch (error) {
    console.error('order creation failed:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})
   
ordersRoute.put('/', async (req, res) => {
  const order = await order.findByIdAndupdate(
    req.params.id,
    {
      status: req.body.status
    },{new: true}
  )
  if(!orders) {
    return res.status(400).send('the order cannot be upadte!')
  } else {
    res.status(201).send(order);
  }
})  
 
ordersRoute.delete('/delete/:id', async (req, res) => {
  try {
    const deletedOrder = await order.findByIdAndRemove(req.params.id);

    if (deletedOrder) {
      // Delete all orderItems linked to this order
      await Promise.all(
        deletedOrder.orderItems.map(async (orderItemId) => {
          await OrderItem.findByIdAndRemove(orderItemId);
        })
      );

      return res.status(200).json({
        success: true,
        message: 'The order is deleted!'
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: err
    });
  }
});

ordersRoute.get('/get/totalsales', async (req, res) => {
  const totalSales = await order.aggregate([
    {
      $group: {
        _id: null,
        totalsales:{
           $sum:"$totalPrice"
        }
      }
    }
   
  ])  
  if (!totalSales) {
    return res.status(400).send('the order slaes cannot be generated')
  } 
  res.send({ totalSales: totalSales.pop().totalsales})
})

ordersRoute.get('/get/count', async(req, res) => {
  const orderCount = await order.countDocuments(
    (Count=>Count)
  ) 
  if (!orderCount) {
    res.status(500).send("Internal Server Error");
  } else {
    res.status(201).send(orderCount);
  }
})
ordersRoute.get(`/get/userorders/:userid`, async (req, res) => {
    const userOrderList = await order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
}) 



module.exports = ordersRoute;
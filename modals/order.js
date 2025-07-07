const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { OrderItem } = require('../modals/orderItems');
 
const orderSchema = mongoose.Schema({
  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orderItemsSchema',
    required: true
  }],
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userSchema',
    required: true
  },
  shippingAddress1: {
    type: String,
    required: true
  },
  shippingAddress2: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zip: {
    type: Number,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

  
const order = mongoose.model("orderSchema", orderSchema);



module.exports = order;

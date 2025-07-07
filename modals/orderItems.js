const express = require('express');
const mongoose = require('mongoose');


const orderItemsSchema = mongoose.Schema({
    quantity: {
        type:Number,
        require: true,
        
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productSchema',
        required: true,
        
    },
    size: {
        type: String,
      }
}) 

exports.OrderItem = mongoose.model('orderItemsSchema',orderItemsSchema);
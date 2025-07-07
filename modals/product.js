const express = require('express');
const app = express();
const mongoose = require('mongoose');
 
const productSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  richDescription: {
    type: String,
    default: ' '
  },
  size: {
    type: String,
    // required: true
  },
 category: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Category',
         required:true
      
      },

  image: {
    type: String,
    default: 'pending'

  },
  images: [{
    type: String
  }],
  brand: {
    type: String,
    default: ''
        
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max:255
  },
  rating: {
    type: Number,
    deafult:0
  },
  numReviews: {
    type: Number,
    default:0
    
  },
  isFeatured: {
    type: Boolean,
    default:false
  },
  dateCreated: {
    type: Date,
    default:Date.now()
  }

},
  {
        timestamps: true
  })
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
productSchema.set('toJSON', {
  vertuals:true,
})
const product = mongoose.model("productSchema", productSchema);
module.exports = product;

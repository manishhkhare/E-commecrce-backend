const express = require('express');
const app = express();
const mongoose = require('mongoose');
 
const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      passwordHash: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        require:true
      },
      street: {
        type: String,
        required: true
    },
    apartment: {
        type: String,
        required:true
    },
    city: {
       type:String,
        required:true
    },
    zip: {
        type: String,
        required:true
    } 
    ,
    country: {
        type: String,
        required:true
    }
    ,
    phone: {
        type: Number,
        required:true
    }
}) 
adminSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

adminSchema.set('toJSON', {
    virtuals: true,
});

const admin = mongoose.model("adminSchema", adminSchema);
module.exports = admin;

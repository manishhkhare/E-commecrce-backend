const express = require('express');
const app = express();
const mongoose = require('mongoose');
 
const userSchema = mongoose.Schema({
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
        default:false
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
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

const user = mongoose.model("userSchema", userSchema);
module.exports = user;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
 
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: { 
    type: String,
  },
  color: {
    type: String,
  }
})
const category = mongoose.model("Category", categorySchema);
module.exports = category;
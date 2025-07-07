// ✅ All imports at top
const express = require('express');
const productRoute = express.Router();
const mongoose = require('mongoose');
const Product = require('../modals/product');
const Category = require('../modals/category');
const multer = require('multer');
const product = require('../modals/product');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = isValid ? null : new Error('Invalid image type');
    cb(uploadError, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

const uploadOptions = multer({ storage });

// ✅ Routes start here

// Get all products
productRoute.get('/', async (req, res) => {
  // let filter = {};
  // if (req.query.category) {
  //   filter = { category: req.query.category.split(',') };
  // } 
  // console.log(req.query)
  
  const productList = await Product.find().populate('category', 'name');
  
  if (!productList) return res.status(500).json({ success: false });
  res.status(200).send( productList );
});

// Create new product
productRoute.post('/', uploadOptions.single('image'), async (req, res) => {
  var category = await Category.findOne({ name: req.body.category });

  if (!category) {
    category = await new Category({ name: req.body.category }).save();
  } 
  

  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No Image in the Request' });

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  
  let product =  await new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: category._id,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();
 
  if (!product) return res.status(500).json({ error: 'The Product cannot be created' });

  res.send(product);
});

// Update product
productRoute.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product Id');
  }
  //  console.log(req.category)
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send('Invalid Category');
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) return res.status(500).send('The product cannot be updated!');
  res.send(product);
});

// Delete product
productRoute.delete('/:id', async (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then(product => {
      if (product) {
        return res.status(200).json({ success: true, message: 'The product is deleted' });
      } else {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
    })
    .catch(err => {
      return res.status(500).json({ success: false, error: err });
    });
});

// Get featured products
productRoute.get('/count', async (req, res) => {
  // const count = req.params.count ? req.params.count : 0;
  const products = await Product.countDocuments();
  if (!products) {
    return res.status(500).send("internal server error");

  } else {
    return res.status(201).send({ productsCount: products })
  }
    
    
    
//     .find({ isFeatured: true }).limit(+count);
//   if (!products) return res.status(500).json({ success: false });
 res.send(products);
});

// Upload gallery images
productRoute.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send('Invalid Product Id');
  }

  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

  if (files) {
    files.map(file => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { images: imagesPaths },
    { new: true }
  );

  if (!product) return res.status(500).send('The gallery cannot be updated');
  res.send(product);
});

module.exports = productRoute;

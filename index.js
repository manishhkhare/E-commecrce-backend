const express = require('express');
const app = express(); 
const mongoose = require('mongoose')
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const { dataBase } = require('./config/db');
const productRoute = require('./Routes/products');
const categoriesRoute = require('./Routes/categories');
const usersRoute = require('./Routes/users');
const ordersRoute = require('./Routes/orders');
const { isAdminRoute } = require('./Routes/adminRoute');
const cartRoute = require('./Routes/cart');
const authjwt = require('./helpers/expressjwt');
const env = require('dotenv').config();
const allowOrigin = [
    'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://e-commecrce-backend-14.onrender.com/'
];

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowOrigin.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed for this origin: ' + origin));
        }
    }
}));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use('/api/v3/user', usersRoute)
app.use('/public/uploads', express.static(path.join(__dirname, './public/uploads')));
console.log(path.join(__dirname, '/public/uploads'))
app.use(authjwt());
app.use('/api/v1/Product',productRoute)
app.use('/api/v2/order', ordersRoute)
app.use('/api/v6/cart', cartRoute);
app.use('/api/v4', categoriesRoute)
app.use('/api/v5',isAdminRoute)
const PORT = 3000;


app.listen(PORT, () => {
    console.log(`application are running on ${PORT}`)
})
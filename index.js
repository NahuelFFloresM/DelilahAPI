let express = require('express');
var app = express();
var db = require('./server.js');
var middlewares = require('./middleware/wrapper.js');

//DEFINED ROUTES TO THEIR FILES
const userRoutes = require('./routes/usuario');
const pedidoRoutes = require('./routes/pedido');
const productRoutes = require('./routes/product');

app.get('/', (req,res) => res.status(200).json('Welcome to Delilah API'));
app.use('/user',userRoutes);
app.use('/pedido',pedidoRoutes);
app.use('/product',productRoutes);


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

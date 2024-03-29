let express = require('express');
let app = express();
let db = require('./server.js');
let middlewares = require('./middleware/wrapper.js');
const bodyParser = require('body-parser');


//DEFINED ROUTES TO THEIR FILES
const userRoutes = require('./routes/usuario');
const orderRoutes = require('./routes/order');
const productRoutes = require('./routes/product');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', (req,res) => res.status(200).json('Welcome to Delilah API'));
app.use('/user',userRoutes);
app.use('/order',orderRoutes);
app.use('/producto',productRoutes);


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

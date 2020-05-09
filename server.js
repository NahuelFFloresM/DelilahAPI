const Sequelize = require('sequelize');

// OPTION 1
const sequelize = new Sequelize('F7Af6h5gdW', 'F7Af6h5gdW', 'dVtZg9SZFJ', {
    host: 'remotemysql.com',
    dialect: 'mysql'
})

// OPTION 2
// const sequelize = new Sequelize('mysql://F7Af6h5gdW:dVtZg9SZFJ@https://remotemysql.com/phpmyadmin:3306/F7Af6h5gdW');

module.exports = sequelize;
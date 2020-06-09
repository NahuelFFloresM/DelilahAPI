let Sequelize = require('sequelize');
let sequelizedb;

// OPTION 1
sequelizedb = new Sequelize('F7Af6h5gdW', 'F7Af6h5gdW', 'dVtZg9SZFJ', {
    host: 'remotemysql.com',
    dialect: 'mysql'
})

// OPTION LOCALHOST
// try{
//     sequelizedb = new Sequelize('f7af6h5gdw', 'root', '', {
//     host: '127.0.0.1',
//     dialect: 'mysql',
//     operatorsAliases: 0
// })
// } catch(e){
//     console.log(e);
// }


module.exports = sequelizedb;
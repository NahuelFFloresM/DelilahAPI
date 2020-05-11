const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../server.js');
const bcrypt = require('bcrypt');
let middlewares = require('../middleware/wrapper.js');
const secret = "passsecret";


router.get('/', middlewares.isJsonUser,(req,res) => {
    const query = 'SELECT * FROM usuario';
    db.query(query,{ raw:true }).then(result => {
        const [resultados] = result;
        res.status(200).json(resultados);
    }).catch(e => {
        res.status(204).json(e);
    });
});

router.get('/:id',(req,res) => {
    const query = "SELECT * FROM usuario as us WHERE us.id ="+ req.params.id +";";
    db.query(query,{ raw:true, type: db.QueryTypes.SELECT}).then(response => {
        const result = response;
        res.status(200).json(result);
    }).catch(e => {
        res.status(204).json(e);
    });
});

router.post('/login',middlewares.isJsonUser,(req,res) => {
    const query = `SELECT id FROM usuario AS us WHERE us.nombre ='${req.body.email}' AND us.contraseña ='${req.body.contrasenia}'`
    db.query(query, {raw:true, type: db.QueryTypes.SELECT}).then(response => {
        if (response){
            try {
                var token = jwt.sign(req.body.user, secret, { algorithm: 'RS256'});
                res.status(200).json({token: token,message:'Loggin Succesfull'});
              } catch(err) {
                res.status(200).json({error: err});
              }
        } else {
            res.status(400).json({message:"Wrong Email or Password"});
        }
    });
});

router.post('/register',(req,res) => {
    const insert = "INSERT INTO usuario (nombre,apellido,nickname,direccion,email,telefono,contraseña) ";
    const value = `VALUES (${req.body.nombre},${req.body.apellido},${req.body.nickname},${req.body.direccion},${req.body.email},${req.body.telefono},${req.body.contraseña});`
    const query = insert+value;
    db.query(query,{ raw:true, type: db.QueryTypes.SELECT}).then(response => {
        const result = response;
        res.status(200).json(result);
    }).catch(e => {
        res.status(204).json(e);
    });
});

module.exports = router;
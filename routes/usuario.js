const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../server.js');
var middlewares = require('../middleware/wrapper.js');


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

router.post('/',(req,res) => {
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
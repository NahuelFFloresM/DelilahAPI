const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../server.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
let middlewares = require('../middleware/wrapper.js');
let secret = "passsecret";

router.get('/users', middlewares.isAdmin,(req,res) => {
    const query = `SELECT * FROM usuario;`;
    db.query(query,{ raw:true, type: db.QueryTypes.SELECT}).then(response => {
        const result = response;
        res.status(200).json(result);
    }).catch(e => {
        res.status(204).json(e);
    });
});

router.get('/account/:id', middlewares.isLoggedin,(req,res) => {
    const query = `SELECT * FROM usuario as us WHERE us.id =?;`;
    db.query(query,{replacements:[req.params.id], raw:true, type: db.QueryTypes.SELECT}).then(response => {
        const [result] = response;
        res.status(200).json(result);
    }).catch(e => {
        res.status(204).json(e);
    });
});

router.post('/login',(req,res) => {
    const userpass = req.body.password.toLowerCase();
    const useremail = req.body.email.toLowerCase();
    const query = `SELECT email,password FROM usuario AS us WHERE us.email =?;`
    db.query(query, { replacements:[useremail],raw:true, type: db.QueryTypes.SELECT}).then(response => {
        let [data] = response;
        if (data){
            bcrypt.compare(userpass, data.password, function(err, result) {
                if (result){
                    let token = jwt.sign({user: useremail}, 'passsecret',{ algorithm: 'HS256'});
                    res.status(200).json({token: token,message:'Loggin Succesfull'});
                } else {
                    res.status(206).json({error: "Wrong password"});
                }
            });
        } else {
            res.status(400).json({message:"Wrong Email"});
        }
    }).catch(e => {
        res.status(400).json(e);
    });
});

router.post('/register',middlewares.isJsonNewUser,(req,res) => {
    const insert = "INSERT INTO usuario (username,surname,nickname,address,email,telephone,password,permissions) ";
    const value = `VALUES (?,?,?,?,?,?,?,0);`
    const query = insert+value;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        let arrayColumns = [req.body.username,req.body.surname,req.body.nickname,req.body.address,req.body.email,req.body.telephone,hash];
        db.query(query,{replacements:arrayColumns, raw:true }).then(response => {
            res.status(200).json({"message":"Registrado Exitosamente"});
        }).catch(e => {
            res.status(500).json({"error": "Error inesperado, intente nuevamente"});
        });
    });
});

module.exports = router;
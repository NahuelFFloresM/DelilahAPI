const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../server.js');
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
    const query = `SELECT * FROM usuario as us WHERE us.id ='${req.params.id}';`;
    db.query(query,{ raw:true, type: db.QueryTypes.SELECT}).then(response => {
        const [result] = response;
        res.status(200).json(result);
    }).catch(e => {
        res.status(204).json(e);
    });
});

router.post('/login',(req,res) => {
    let userpass = req.body.password.toLowerCase();
    let useremail = req.body.email.toLowerCase();
    const query = `SELECT id FROM usuario AS us WHERE us.email ='${useremail}' AND us.password ='${userpass}';`
    db.query(query, {raw:true, type: db.QueryTypes.SELECT}).then(response => {
        let [data] = response;
        if (data){
            let token = jwt.sign(req.body, secret,{ expiresIn: '1h' });
            res.status(200).json({token: token,message:'Loggin Succesfull'});
        } else {
            res.status(400).json({message:"Wrong Email or Password"});
        }
    }).catch(e => {
        res.status(400).json(e);
    }) ;
});

router.post('/register',(req,res) => {
    const insert = "INSERT INTO usuario (name,surname,nickname,address,email,telephone,password) ";
    const value = `VALUES (${req.body.name},${req.body.surname},${req.body.nickname},${req.body.address},${req.body.email},${req.body.telephone},${req.body.password});`
    const query = insert+value;
    db.query(query,{ raw:true, type: db.QueryTypes.SELECT}).then(response => {
        const result = response;
        res.status(200).json(result);
    }).catch(e => {
        res.status(204).json(e);
    });
});

module.exports = router;
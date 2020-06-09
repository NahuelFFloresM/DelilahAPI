const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../server.js');
const jwt = require('jsonwebtoken');
const secret = "passsecret";

const middlewares = {

    isAdmin: function(req,res,next) {
        const query = `SELECT id,password,email FROM usuario AS us WHERE us.email = ? AND us.permissions = 1`;
        db.query(query,{replacements:[req.get('email')], raw:true, type: db.QueryTypes.SELECT }).then(result => {
            let [data] = result;
            bcrypt.compare(req.get('password'), data.password, function(err, result) {
                if (result){
                    next();
                } else {
                    res.status(206).send({mesage: 'User NOT Allowed'});
                }
            });
        }).catch(e => {
            res.status(500).send({mesage: "Internal Server Error"});
        });
    },

    isJsonPedido: function(req,res,next){
        let json = req.body;
        if (json.date && json.total_price && json.state && json.id_user && json.pay_type){
            next();
        } else {
            res.status(400).send("Datos mal armados.");
        }
    },

    isLoggedin: function(req,res,next){
        let token = req.get('token');
        jwt.verify(token,secret, (err,decoded) => {
            if (decoded){
                next();
            } else {
                res.status(206).send({message:"err"});
            }
        });
    },

    isJsonNewUser: function(req,res,next){
        let json = req.body;
        if (json.username && json.surname && json.nickname && json.address && json.email && json.telephone && json.password){
            db.query('SELECT id FROM usuario WHERE email = ?',{replacements:[json.email], raw:true, type: db.QueryTypes.SELECT }).then(result => {
                let [status] = result;
                if(!status){
                    next();
                } else {
                    res.status(206).send({mesage: 'Email ya registardo'});
                }
            }).catch(e => {
                res.status(206).send({message: 'Hubo un error inesperado, pruebe nuevamente'});
            });
        } else {
            res.status(400).send("Datos mal armados.");
        }
    }
}



module.exports = middlewares;
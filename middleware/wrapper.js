const express = require('express');
const db = require('../server.js');
const jwt = require('jsonwebtoken');

const middlewares = {

    isAdmin: function(req,res,next) {
        const query = `SELECT id FROM usuario AS us WHERE us.email = '${req.body.email}' AND us.permiso = true`;
        db.query(query,{ raw:true, type: db.QueryTypes.SELECT }).then(result => {
            if(result){
                next();
            } else {
                res.status(204).json({mesage: 'User NOT Allowed'});
            }
        }).catch(e => {
            res.status(204).json({mesage: e});
        });
    },

    isLoggedin: function(req,res,next){
        const token = req.body.token;
        // jwt.verify(token,'secret')
    },

    isJsonUser: function(req,res,next){
        let json = req.body;
        if (json.nombre && json.apellido && json.nickname && json.direccion && json.email && json.telefono && json.contrasenia && json.permisos){
            next()
        } else {
            res.status(204).json({message: 'Datos mal armados.'});
        }
    }

}



module.exports = middlewares;
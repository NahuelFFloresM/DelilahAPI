const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../server.js');

router.get('/',(req,res) => {
    const query = `SELECT * 
    FROM pedido AS pe
    INNER JOIN usuario AS us ON us.id = pe.id_usuario
    INNER JOIN producto_pedido AS pp ON pp.id_pedido = pe.id
    INNER JOIN producto AS pr ON pr.id = pp.id_producto;`;
    db.query(query,{ raw:true }).then(result => {
        const [resultados] = result;
        res.status(200).json(resultados);
    }).catch(e => {
        res.status(204).json(e);
    });
});

router.get('/:id',(req,res) => {
    // const pedido_select = "SELECT pp.id_pedido,pr.nombre,pr.imagen,pr.precio,pe.tipo_pago,pe.precio_total,pe.estado,pe.id_usuario, pp.cantidad_producto ";
    // const pedido_from = "FROM producto_pedido AS pp,producto AS pr,pedido AS pe ";
    // const pedido_where = "WHERE pp.id_pedido ="+ req.params.id +" AND pp.id_producto = pr.id AND pp.id_pedido = pe.id;";
    const query = `SELECT * 
    FROM pedido AS pe
    INNER JOIN usuario AS us ON us.id = pe.id_usuario
    INNER JOIN producto_pedido AS pp ON pp.id_pedido = pe.id AND pp.id_pedido = ${req.params.id}
    INNER JOIN producto AS pr ON pr.id = pp.id_producto;`;
    
    //INNER JOIN
    db.query(query,{ raw:true, type: db.QueryTypes.SELECT}).then( response => {
        // Saco la respuesta del arreglo y envio el objeto
        const [resultado] = response;
        res.status(200).json(resultado);
    }).catch(e => {
        res.status(204).json(e);
    });
});

module.exports = router;
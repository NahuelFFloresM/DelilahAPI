const express = require('express');
const router = express.Router();
const db = require('../server.js');
let middlewares = require('../middleware/wrapper.js');


// TODA LA INFO DE LOS PEDIDOS PARA EL ADMIN
router.get('/',middlewares.isAdmin,(req,res) => {
    const query = `SELECT * 
    FROM pedido AS pe
    INNER JOIN usuario AS us ON us.id = pe.id_user
    INNER JOIN producto_pedido AS pp ON pp.id_pedido = pe.id
    INNER JOIN producto AS pr ON pr.id = pp.id_producto;`;
    db.query(query,{ raw:true, type: db.QueryTypes.SELECT}).then(result => {
        const resultados = result;
        res.status(200).json(resultados);
    }).catch(e => {
        res.status(206).json(e);
    });
});

// TODA LA INFO DE UN PEDIDO PARA LOS ADMINS
router.get('/:id',middlewares.isAdmin,(req,res) => {
    const query = `SELECT *
    FROM pedido AS pe
    INNER JOIN usuario AS us ON us.id = pe.id_user
    INNER JOIN producto_pedido AS pp ON pp.id_pedido = pe.id AND pp.id_pedido = ?
    INNER JOIN producto AS pr ON pr.id = pp.id_producto;`;

    db.query(query,{ replacements:[req.params.id], raw:true, type: db.QueryTypes.SELECT}).then( response => {
        // Saco la respuesta del arreglo y envio el objeto
        const resultado = response;
        res.status(200).json(resultado);
    }).catch(e => {
        res.status(500).json(e);
    });
});

// UN PEDIDO PARA EL USUARIO
router.get('/myorder/:id_pedido', middlewares.isLoggedin, (req,res) => {
    const query = `SELECT pe.date,pe.pay_type,pe.total_price,pe.state
    FROM pedido AS pe
    INNER JOIN usuario AS us ON us.id = pe.id_usuario
    INNER JOIN producto_pedido AS pp ON pp.id_pedido = pe.id AND pp.id_pedido = ?
    INNER JOIN producto AS pr ON pr.id = pp.id_producto;`;

    db.query(query,{replacements: [req.params.id_pedido], raw:true, type: db.QueryTypes.SELECT}).then( response => {
        // Saco la respuesta del arreglo y envio el objeto
        const [resultado] = response;
        res.status(200).json(resultado);
    }).catch(e => {
        res.status(500).json(e);
    });
});

// CREACION DE LOS PEDIDOS DE PARTE DE USUARIO
router.post('/', middlewares.isLoggedin, middlewares.isJsonPedido,(req,res) => {
    let query = 'INSERT INTO pedido(date,pay_type,total_price,state,id_user) VALUES(?,?,?,?,?);';
    let arrayColumns = [
        req.body.date,
        req.body.pay_type,
        req.body.total_price,
        req.body.state,
        req.body.id_user
    ];
    let foodItems = req.body.items;
    console.log(query);
    db.query(query,{ replacements:arrayColumns, raw:true }).then( response => {
        let pedido_producto_qry = `INSERT INTO producto_pedido(id_producto,id_pedido,producto_quantity) VALUES`;
        let arrayFood = [];
        // INSERTO LOS ITEMS DEL PEDIDO
        foodItems.forEach( element => {
            pedido_producto_qry += `(?,?,?),`;
            arrayFood.push(element.id_producto);
            arrayFood.push(response[0]);
            arrayFood.push(element.producto_quantity);
        });
        /// REMUEVO LA COMA FINAL INNESECARIA
        pedido_producto_qry = pedido_producto_qry.slice(0, -1);
        db.query(pedido_producto_qry, { replacements:arrayFood ,raw: true}).then( response => {
            res.status(200).json({"message":"Pedido creado exitosamente."});
        }).catch(e => {
            res.status(500).json({"error": e, "message":"Hubo un problema, vuelva a intentarlo"});
        });
    }).catch(e => {
        res.status(500).json({"error":e});
    });
});


/// ADMIN EDIT
router.put('/:id_pedido', middlewares.isAdmin,(req,res) => {
    let query = "UPDATE pedido SET ";
    let arrayColumns = [];
    // CHEQUEO QUE DATOS ENVIA EL ADMIN
    if (req.body.date){
        query += `date='?',`;
        arrayColumns.push(req.body.date);
    };
    if(req.body.pay_type){
        query += `pay_type='?',`;
        arrayColumns.push(req.body.pay_type);
    };
    if(req.body.total_price){
        query += `total_price=?,`;
        arrayColumns.push(req.body.total_price);
    };
    if(req.body.state){
        query += `state='?',`;
        arrayColumns.push(req.body.state);
    };
    if(req.body.id_user){
        query += `id_user=?,`;
        arrayColumns.push(req.body.id_user);

    // Remuevo ultima coma;
    }
    // Remuevo ultima coma;
    query = query.slice(0, -1);
    query += ` WHERE id=?;`;
    arrayColumns.push(parseInt(req.params.id_pedido));
    db.query(query,{ replacements: arrayColumns, raw:true }).then( response => {
        res.status(200).json({"message":"Pedido editado exitosamente."});
    }).catch(e => {
        res.status(500).json({"error":"error en query"});
    });
});

router.put('/orderItems/:id', middlewares.isAdmin, (req,res) => {
    let arrayItems = [];
    let query = `UPDATE producto_pedido SET producto_quantity = ? WHERE id_producto = ? AND id_pedido = ?;`;
    arrayItems.push(req.body.producto_quantity);
    arrayItems.push(req.body.id_producto);
    arrayItems.push(parseInt(req.params.id_pedido));
    db.query(query,{replacements:arrayItems, raw: true}).then( response => {
        res.status(200).json({"message":"Producto editado exitosamente."});
    }).catch(e => {
        res.status(500).json({"error": e, "message":"Hubo un problema, vuelva a intentarlo"});
    });
});

module.exports = router;
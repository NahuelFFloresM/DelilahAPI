const express = require('express');
const router = express.Router();
let middlewares = require('../middleware/wrapper.js');
const db = require('../server.js');

router.get('/',(req,res) => {
    const query = 'SELECT * FROM producto';
    db.query(query,{ raw:true, type: db.QueryTypes.SELECT}).then(result => {
        const resultados = result;
        res.status(200).json(resultados);
    }).catch(e => {
        res.status(500).json({"error": e});
    });
});

router.get('/favorites/:id', middlewares.isLoggedin,(req,res) =>{
    const query = `SELECT * FROM usuario_producto as up INNER JOIN producto AS pr ON pr.id = up.id_producto AND up.id_user = ?`;
    db.query(query,{ replacements:[req.params.id], raw:true, type: db.QueryTypes.SELECT }).then(result => {
        const resultados = result;
        res.status(200).json(resultados);
    }).catch(e => {
        res.status(500).json({"error":e});
    })
})

router.get('/:id',(req,res) => {
    const query = `SELECT * FROM producto as us WHERE us.id =?;`;
    db.query(query,{ replacements:[req.params.id],raw:true, type: db.QueryTypes.SELECT}).then(response => {
        const result = response;
        res.status(200).json(result);
    }).catch(e => {
        res.status(206).json(e);
    });
});

router.post('/',middlewares.isAdmin, (req,res) => {
    const query = "INSERT INTO producto(name_food,imageurl,price) VALUES (?,?,?);";
    const arrayFood = [req.body.name_food,req.body.imageurl,req.body.price];
    db.query(query,{ replacements:arrayFood,raw:true}).then(response => {
        res.status(200).json(response);
    }).catch(e => {
        res.status(400).json({"error":e});
    });
});

router.post('/favorites', middlewares.isLoggedin,(req,res) => {
    const query = "INSERT INTO usuario_producto (id_prodcuto,id_user) VALUES (?,?)";
    db.query(query,{replacements:[req.body.id_producto,req.body.id_user], raw:true}).then(response => {
        const [result] = response;
        res.status(200).json(result);
    }).catch(e => {
        res.status(204).json(e);
    });
});

router.put('/:id',middlewares.isAdmin, (req,res) => {
    let query = `UPDATE producto SET `;
    let arrayValues = []
    if (req.body.price){
        query += `price = ?,`;
        arrayValues.push(req.body.price);
    }
    if (req.body.name){
        query += `name_food = ?,`;
        arrayValues.push(req.body.name_food);
    }
    if (req.body.imageurl){
        query += `imageurl = ?,`;
        arrayValues.push(req.body.imageurl);
    }
    query = query.slice(0,-1);
    query +=` WHERE producto.id = ?;`;
    arrayValues.push(req.params.id);
    
    db.query(query,{replacements: arrayValues,raw:true}).then(response => {
        res.status(200).json(response);
    }).catch(e => {
        res.status(500).json(e);
    });
})

router.delete('/:id', middlewares.isAdmin, (req,res) => {
    let query = `DELETE FROM producto WHERE id = ?;`
    db.query(query,{replacements:[req.params.id], raw:true}).then(response => {
        res.status(200).json({"message": "Borrado con Exito" });
    }).catch(e => {
        res.status(400).json(e);
    });
})

module.exports = router;
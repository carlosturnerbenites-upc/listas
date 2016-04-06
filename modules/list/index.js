const express = require('express'),
	router = express.Router(),
	bodyParser = require('body-parser'),
	/* Importar la clase List (manejo de nodos) */
	List = require('./list'),
	/* Importar la clase Nodo - nodo */
	Node = require('./node'),

	/* Instanciar un objeto de la clase lista*/
	list = new List()


router.use(bodyParser.json())

/* endpoint - Mostar la lista*/
router.get('/show-list', (req, res) => res.json(list.showList()))
router.get('/keys', (req, res) => res.json({keys :Object.getOwnPropertyNames(new Node({}))}))

/* endpoint - Agregar Nodos*/
router.post('/add', (req, res) => {
	var result = list.insert(req.body)
	console.log("-------------")
	console.log(result.list)
	console.log("-------------")
	res.json(result)
})

/* endpoint - Buscar Nodos*/
router.post('/find', (req, res) => {
	var result = list.find(req.body)
	res.json(result)
})

/* endpoint - Borrar Nodos*/
router.delete('/delete', (req, res) => {
	var result = list.delete(req.body)
	res.json(result)
})

/* endpoint - Editar Nodos*/
router.put('/update', (req, res) => {
	var result = list.edit(req.body)
	res.json(result)
})



module.exports = router

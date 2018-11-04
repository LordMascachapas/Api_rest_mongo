'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Product = require('./models/product')

const app = express()
const mongoUrl = 'mongodb://localhost:27017/shop'
const port = 3000

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())



app.get('/api/product/:productId', (req, res) => {
	console.log('GET /api/product/:productId')
	let productId = req.params.productId

	Product.findById(productId, (err, product) => {
		if(err)
			return res.status(500).send({message:`Error al realizar la petición: ${err}`})
		if(!product)
			return res.status(404).send({message:`El producto no existe`})
		res.status(200).send({product})
	})
})

app.post('/api/product', (req, res) => {
	console.log('POST /api/product')
	console.log(req.body)

	let product = new Product()
	product.name = req.body.name
	product.picture = req.body.picture
	product.price = req.body.price
	product.category = req.body.category
	product.description = req.body.description

	product.save((err, productStored) => {
		if(err)
			res.status(500).send({message:`Error al salvar el producto: ${err}`})
		res.status(200).send({product: productStored})
	})
})

app.put('/api/product/:productId', (req, res) =>{
	let productId = req.params.productId
	let update = req.body

	Product.findByIdAndUpdate(productId, update, (err,productUpdated) => {
		if(err)
			res.status(500).send({message: `Error al actualizar el producto: ${err}`})
		res.status(200).send({product: productUpdated})
	})
})

app.delete('/api/product/:productId', (req,res) => {
	let productId = req.params.productId
	Product.findById(productId, (err, product) => {
		if(err)
			return res.status(500).send({message:`Error al borrar el producto: ${err}`})

		product.remove(err => {
			if(err)
				res.status(500).send({message:`Error al borrar el producto: ${err}`})
			res.status(200).send({message:'El producto ha sido borrado'})	
		})
	})
})



mongoose.connect(mongoUrl, { useNewUrlParser: true }, (err, res) =>{
	if(err) console.log(`Error al conectar con la bases de datos: ${err}`)
	app.listen(port, () => {
		console.log(`API REST corriendo en http://localhost:${port}`)
	})
})

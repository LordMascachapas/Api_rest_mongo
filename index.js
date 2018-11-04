'use strict'

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Product = require('./models/product')
const User = require('./models/user')

const app = express()
const mongoUrl = 'mongodb://localhost:27017/shop'
const port = 3000

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


/*------------------PRODUCTS--------------------*/
app.get('/api/product', (req, res) => {
	console.log('GET /api/product')

	Product.find({}, (err, products) => {
		if(err)
			return res.status(500).send({message: `Error al realizar peticion: ${err}`})
		res.status(200).send({products})
	})
})

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
	let update = req.body
	console.log('PUT /api/product/:productId')
	console.log(update)

	let productId = req.params.productId
	Product.findByIdAndUpdate(productId, update, (err,oldProduct) => {
		if(err)
			res.status(500).send({message: `Error al actualizar el producto: ${err}`})
		res.status(200).send({oldProduct})
	})
})

app.delete('/api/product/:productId', (req,res) => {
	console.log('DELETE /api/product/:productId')

	let productId = req.params.productId
	Product.findById(productId, (err, product) => {
		if(err)
			return res.status(500).send({message:`Error al borrar el producto: ${err}`})
		if(!product)
			return res.status(404).send({message:`El producto no existe`})
		product.remove(err => {
			if(err)
				res.status(500).send({message:`Error al borrar el producto: ${err}`})
			res.status(200).send({message:'El producto ha sido borrado'})	
		})
	})
})


/*--------------------USERS----------------------*/
app.get('/api/user', (req, res) => {
	console.log('GET /api/user')

	User.find({}, (err, users) => {
		if(err)
			return res.status(500).send({message: `Error al realizar peticion: ${err}`})
		res.status(200).send({users})
	})
})

app.get('/api/user/:userId', (req, res) => {
	console.log('GET /api/user/:userId')

	let userId = req.params.userId
	User.findById(userId, (err, user) => {
		if(err)
			return res.status(500).send({message: `Error al realizar peticion: ${err}`})
		if(!user)
			return res.status(404).send({message:`El usuario no existe`})
		res.status(200).send({user})
	})
})

app.post('/api/user', (req, res) => {
	console.log('POST /api/user')
	console.log(req.body)

	let user = new User()
	user.name = req.body.name
	user.pwd = req.body.pwd

	user.save((err, userStored) => {
		if(err)
			return res.status(500).send({message: `Error al crear usuario: ${err}`})
		res.status(200).send({message: userStored})
	})
})

app.put('/api/user/:userId', (req, res) => {
	let updated = req.body
	console.log('PUT /api/user/:userId')
	console.log(updated)

	let userId = req.params.userId
	User.findByIdAndUpdate(userId, updated, (err, oldUser) => {
		if(err)
			return res.status(500).send({message: `Error al actualizar usuario: ${err}`})
		res.status(200).send({oldUser})
	})
})

app.delete('/api/user/:userId', (req, res) => {
	console.log('DELETE /api/user/:userId')

	let userId = req.params.userId
	User.findById(userId, (err, user) => {
		if(err)
			return res.status(500).send({message: `Error al borrar usuario: ${err}`})
		if(!user)
			return res.status(404).send({message:`El usuario no existe`})
		user.remove(err => {
			if(err)
				return res.status(500).send({message: `Error al borrar usuario: ${err}`})
			res.status(200).send({message: `El usuario ha sido borrado`})
		})
	})
})


/*----------------------PURCHASES---------------------------*/
app.put('/api/purchase/:userId/:productId', (req, res) => {
	console.log('PUT /api/purchase/:userId/:productId')

	let userId = req.params.userId
	let productId = req.params.productId
	let update = {
		$push:{purchases: productId}
	}
	Product.findById(productId, (err, product) => {	
		if(err)
			return res.status(500).send({message:`Error con el producto al realizar la compra: ${err}`})
		User.findByIdAndUpdate(userId, update, (err, oldUser) => {
			if(err)
				return res.status(500).send({message:`Error al realizar la compra: ${err}`})
			res.status(200).send({oldUser})
		})
	})
})



mongoose.connect(mongoUrl, { useNewUrlParser: true }, (err, res) =>{
	if(err) console.log(`Error al conectar con la bases de datos: ${err}`)
	app.listen(port, () => {
		console.log(`API REST corriendo en http://localhost:${port}`)
	})
})

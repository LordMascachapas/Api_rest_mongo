'use strict'

const User = require('../models/user')
const Product = require('../models/product')

function createUser(req, res){
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
}

function getUser(req, res){
	console.log('GET /api/user/:userId')

	let userId = req.params.userId
	User.findById(userId, (err, user) => {
		if(err)
			return res.status(500).send({message: `Error al realizar peticion: ${err}`})
		if(!user)
			return res.status(404).send({message:`El usuario no existe`})
		res.status(200).send({user})
	})
}

function getUsers(req, res){
	console.log('GET /api/user')

	User.find({}, (err, users) => {
		if(err)
			return res.status(500).send({message: `Error al realizar peticion: ${err}`})
		res.status(200).send({users})
	})
}

function updateUser(req, res){
	let updated = req.body
	console.log('PUT /api/user/:userId')
	console.log(updated)

	let userId = req.params.userId
	User.findByIdAndUpdate(userId, updated, (err, oldUser) => {
		if(err)
			return res.status(500).send({message: `Error al actualizar usuario: ${err}`})
		res.status(200).send({oldUser})
	})
}

function deleteUser(req, res){
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
}

function purchase(req, res){
	console.log('PUT /api/purchase/:userId/:productId')

	let userId = req.params.userId
	let productId = req.params.productId
	let update = {
		$push:{purchases: productId}
	}
	Product.findById(productId, (err, product) => {	
		if(err)
			return res.status(500).send({message:`Error con el producto al realizar la compra: ${err}`})
		if(!product)
			return res.status(404).send({message:'El producto no existe'})
		User.findByIdAndUpdate(userId, update, (err, oldUser) => {
			if(err)
				return res.status(500).send({message:`Error al realizar la compra: ${err}`})
			res.status(200).send({oldUser})
		})
	})
}

function getProducts(req, res) {
	console.log('GET /api/user/:userId/products')

	let userId = req.params.userId
	User.findById(userId, async(err, user) => {
		if(err)
			return res.status(500).send({message:`Error con el usuario al realizar la petición: ${err}`})
		if (!user)
			return res.status(404).send({message:'Error, no existe usuario'})
		let productsList = []
		for (var i = user.purchases.length - 1; i >= 0; i--) {
			console.log(user.purchases[i])
			await Product.findById(user.purchases[i], (err, product) => {
				if(err)
					return res.status(500).send({message:`Error con el usuario al realizar la petición: ${err}`})
				if(!product)
					return res.status(500).send({message:'Error, no existe el producto'})
				console.log(product)
				productsList[productsList.length] = product
			})
		}
		res.status(200).send({productsList})
	})
}

module.exports = {
	createUser,
	getUser,
	getUsers,
	updateUser,
	deleteUser,
	purchase,
	getProducts
}

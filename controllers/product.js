'use strict'

const Product = require('../models/product')

function createProduct(req, res){
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
}

function getProduct(req, res){
	console.log('GET /api/product/:productId')

	let productId = req.params.productId
	Product.findById(productId, (err, product) => {
		if(err)
			return res.status(500).send({message:`Error al realizar la petición: ${err}`})
		if(!product)
			return res.status(404).send({message:`El producto no existe`})
		res.status(200).send({product})
	})
}

function getProducts(req, res){
	console.log('GET /api/product')

	Product.find({}, (err, products) => {
		if(err)
			return res.status(500).send({message: `Error al realizar peticion: ${err}`})
		res.status(200).send({products})
	})
}

function updateProduct(req, res){
	let update = req.body
	console.log('PUT /api/product/:productId')
	console.log(update)

	let productId = req.params.productId
	Product.findByIdAndUpdate(productId, update, (err,oldProduct) => {
		if(err)
			res.status(500).send({message: `Error al actualizar el producto: ${err}`})
		res.status(200).send({oldProduct})
	})
}

function deleteProduct(req, res){
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
}

module.exports = {
	createProduct,
	getProduct,
	getProducts,
	updateProduct,
	deleteProduct
}
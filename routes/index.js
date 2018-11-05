'use strict'

const express = require('express')
const api = express.Router()

const Product = require('../controllers/product')
const User = require('../controllers/user')

api.get('/product', Product.getProducts)
api.get('/product/:productId', Product.getProduct)
api.post('/product', Product.createProduct)
api.put('/product/:productId', Product.updateProduct)
api.delete('/product/:productId', Product.deleteProduct)

api.get('/user', User.getUsers)
api.get('/user/:userId', User.getUser)
api.post('/user', User.createUser)
api.put('/user/:userId', User.updateUser)
api.delete('/user/:userId', User.deleteUser)
api.put('/purchase/:userId/:productId', User.purchase)

module.exports = api

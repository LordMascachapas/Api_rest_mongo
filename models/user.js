'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	pwd: {
		type: String,
		required: true
	},
	purchases:[String] 
})

module.exports = mongoose.model('User', UserSchema)

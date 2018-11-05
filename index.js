'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config =require('./config')

mongoose.connect(config.db, { useNewUrlParser: true }, (err, res) =>{
	if(err) console.log(`Error al conectar con la bases de datos: ${err}`)
	app.listen(config.port, () => {
		console.log(`API REST corriendo en http://localhost:${config.port}`)
	})
})

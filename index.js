'use strict'

const express = require('express')

const app = express()
const port = 3000

app.get('/home', (req, res) =>{
	res.send({message: 'Hola Mundo!'})
})

app.listen(port, () => {
	console.log(`API REST corriendo en http://localhost:${port}`)
})
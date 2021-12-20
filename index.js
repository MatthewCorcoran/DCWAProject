var express = require('express')
var lecturersfile = require ('./files/lecturersfile')
var sql = require ('./files/sql')

var app = express()

app.get('/', (req,res) =>{
    res.sendFile(__dirname + "/htmlfiles/home.html" )
})

app.get('/listModules', (req, res) => {
	sql.getModules()
		.then((result) => {
			res.render("modules", { modules: result })
		})
		.catch((error) => {
			res.send(error)
		})
})

app.get('/lectures', (req,res) =>{
    res.send(lecturersfile.lectuers)
})
app.listen(3000, () =>{
    console.log("lisening on port 3000")
})
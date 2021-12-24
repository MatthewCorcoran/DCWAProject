var express = require('express')
const bp = require("body-parser")
const { check, validationResult } = require('express-validator')
var sql = require('./files/sql')

var app = express()

app.use(bp.urlencoded({ extended: false }))
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')


app.listen(3000, function () {
	console.log("Server is running on port " + 3000);
});

app.get('/', (req, res) => {
	res.render("index")
})

app.get('/Modules', (req, res) => {
	sql.getmodule()
		.then((result) => {
			console.log(result)
			res.render("modules", { modules: result })
		})
		.catch((error) => {
			res.send(error)
		})
})

app.get('/Students', (req, res) => {
	sql.getstudent()
		.then((result) => {
			console.log(result)
			res.render("students", { students: result })
		})
		.catch((error) => {
			res.send(error)
		})
})



app.get('/Modules/:mid', (req, res) => {
	sql.getmodule(req.params.mid)
		.then((result) => {
			if (result.length > 0) {
				res.render("edit", { mid: result[0].mid, name: result[0].name, credits: result[0].credits, errors: undefined })
				console.log(result);
			} else {
				res.send(`<h3>No module with ID of ${req.params.mid}</h3>`)
			}
		})
		.catch((error) => {
			res.send(error)
		})
})



app.get('/module/students/:mid', (req, res) => {
	sql.getStudentsAgl(req.params.mid)
		.then((result) => {
			res.render("SModules", { students: result, mid: req.params.mid })
		})
		.catch((error) => {
			res.send(error)
		})
})

app.post('/modules/:mid',
	[
		check('name').isLength({ min: 5 }).withMessage("Module name should be a minimum of 5 characters."),
		check('credits').isIn([5, 10, 15]).withMessage("Credits must be 5, 10 or 15.")
	],
	(req, res) => {
		var error = validationResult(req);
		if (error.isEmpty()) {
			sql.setModule(req.params.mid, req.body.name, req.body.credits)
				.then((result) => {
					console.log(result)
					res.render("edit", { mid: req.params.mid, name: req.body.name, credits: req.body.credits, errors: undefined, success: `OK. $` })
				})
				.catch((error) => {
					res.send(error)
				})
		} else {
			res.render("edit", { mid: req.params.mid, name: req.body.name, credits: req.body.credits, errors: error.errors })
		}
	}
)

app.get('/addStudent', (req, res) => {
	res.render("addS", { errors: undefined, sqlError: undefined, sid: "", name: "", gpa: "" })
})

app.post('/addStudent',
	[
		check('sid').isLength({ min: 4, max: 4 }).withMessage("Student ID must be 4 characters."),
		check('name').isLength({ min: 5 }).withMessage("Name must be at least 5 characters."),
		check('gpa').isFloat({ min: 0, max: 4 }).withMessage("GPA must be between 0.0 and 4.0")
	],
	(req, res) => {
		let error = validationResult(req);
		if (error.isEmpty()) {
			sql.addStudent(req.body.sid, req.body.name, req.body.gpa)
				.then((result) => {
					res.redirect("/Students")
				})
				.catch((err) => {
					res.render("addS", { sid: req.body.sid, name: req.body.name, gpa: req.body.gpa, errors: error.errors, sqlError: err.sqlMessage })
				})
		} else {
			res.render("addS", { sid: req.params.sid, name: req.body.name, gpa: req.body.gpa, errors: error.errors, sqlError: undefined })
		}
	}
)

app.get('/students/delete/:sid', (req, res) => {
	sql.deletestudent(req.params.sid)
		.then((result) => {
			res.redirect('/Students')
		})
		.catch((error) => {
			if (error.errno == 1451) {
				res.render("error", { student: req.params.sid, message: "has associated modules and cannot be deleted." })
			} else {
				res.send(`Unknown error occurred while attempting to delete student ${req.params.sid}.`)
			}
		})
})




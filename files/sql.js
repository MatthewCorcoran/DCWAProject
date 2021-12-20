const mysql = require("promise-mysql")
var pool;

mysql.createPool({
	connectionLimit: 3,
	host: '127.0.0.1',
	user: 'root',
	password: 'hello',
	database: 'collegeDB',
	insecureAuth : true


})

.then((result) => {
	pool = result;
})
.catch((error) => {
	console.log(error)
})

const getModules = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from module")
		.then((result) => {
			resolve(result)
		})
		.catch((error) => {
			reject(error)
		})
	})
}


const getStudents = () => {
	return new Promise((resolve, reject) => {
		pool.query("select * from student")
		.then((result) => {
			resolve(result)
		})
		.catch((error) => {
			reject(error)
		})
	})
}





module.exports = {getModules,getStudents}
/*
	
*/



const { hash } = require("./aaJs/hash/bcrypt.js")
const { pool } = require("./aaJs/database/postgresql.js")



if (!process.env.USER) {
	console.log("ERROR missing process.env.var.USER")
	process.exit()
}



pool.query(`DELETE FROM users WHERE u=$1;`, [process.env.USER], (pErr, pRes)=>{
	if (pErr) {
		console.log("ERROR pooling")
		console.log(pErr)
	}
	else console.log("Added user")
})


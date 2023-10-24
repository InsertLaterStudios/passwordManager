/*
	
*/



const { hash } = require("./aaJs/hash/bcrypt.js")
const { pool } = require("./aaJs/database/postgresql.js")



if (!process.env.USER) {
	console.log("ERROR missing process.env.var.USER")
	process.exit()
}
if (!process.env.PASS) {
	console.log("ERROR missing process.env.var.PASS")
	process.exit()
}



hash(process.env.PASS, (hErr, hRes)=>{
	if (hErr) {
		console.log("ERROR hashing")
		console.log(hErr)
	}
	else pool.query(`UPDATE users SET u=$1, h=$2;`, [process.env.USER, hRes], (pErr, pRes)=>{
		if (pErr) {
			console.log("ERROR pooling")
			console.log(pErr)
		}
		else console.log("Added user")
	})
})


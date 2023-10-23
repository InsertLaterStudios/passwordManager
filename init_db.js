/*
	
*/



const {
	pool,
	
	msqe,
	muqe,
	miqeN, miqeV
} = require("./aaJs/database/postgresql.js")



function queryUsers() {
	const query = `CREATE TABLE IF NOT EXISTS users (` +
`i SERIAL PRIMARY KEY,` + // id

`u VARCHAR(20) UNIQUE,` + // username
`h TEXT NOT NULL,` + // hash

`si TEXT UNIQUE,` + // session id
`sh TEXT DEFAULT NULL,` + // session hash

`c TIMESTAMP DEFAULT NOW());`

	pool.query(query, (pErr)=>{ // created
		if (pErr) console.log(pErr)
		else console.log("CREATED users table")
	})
}
function queryPasswords() {
	const query = `CREATE TABLE IF NOT EXISTS passwords (`
`i SERIAL,` + // id
`ui INT,` + // user id

`a TEXT NOT NULL,` + // account name
`p TEXT NOT NULL,` + // password

`u TEXT DEFAULT NULL,` + // username
`e TEXT DEFAULT NULL,` + // email
`ph TEXT DEFAULT NULL,` + // phone

`n INT DEFAULT NULL,` + // pin
`s TEXT DEFAULT NULL,` + // string

`q1 TEXT DEFAULT NULL,` + // question 1
`a1 TEXT DEFAULT NULL,` + // answer 1
`q2 TEXT DEFAULT NULL,` + // question 2
`a2 TEXT DEFAULT NULL,` + // answer 2
`q3 TEXT DEFAULT NULL,` + // question 3
`a3 TEXT DEFAULT NULL,` + // answer 3

`c TIMESTAMP DEFAULT NOW(),` + // created

`FOREIGN KEY (ui) REFERENCES users (i) ON DELETE CASCADE,
CHECK ((q1 IS NULL) OR (a1 IS NOT NULL)),
CHECK ((q2 IS NULL) OR (a2 IS NOT NULL)),
CHECK ((q3 IS NULL) OR (a3 IS NOT NULL)));`

	pool.query(query, (pErr)=>{
		if (pErr) console.log(pErr)
		else console.log("CREATED passwords table")
	})
}

queryUsers()
queryPasswords()
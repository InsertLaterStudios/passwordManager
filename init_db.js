/*
	
*/



const DATABASE = {
	host: "localhost",
	port: 5432,
	user: "sammy",
	database: "passwordManager",
	password: process.env.DB_PASSWORD,
}



const { Pool } = require("pg")
const pool = new Pool(DATABASE)
pool.on("error", (err)=>{
	console.log("pg Pool on(\"error")
	process.exit()
})



pool.query(`CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	
	username VARCHAR(20) UNIQUE,
	hash TEXT NOT NULL,
	
	session_id TEXT UNIQUE,
	session_hash TEXT DEFAULT NULL,
	
	created TIMESTAMP DEFAULT NOW()
);`, (pErr1)=>{
	if (pErr1) console.log(pErr1)
	else {
		console.log("users table CREATED")
		pool.query(`CREATE TABLE IF NOT EXISTS passwords (
	user_id INT,
	
	account TEXT NOT NULL,
	password TEXT NOT NULL,
	
	username TEXT DEFAULT NULL,
	email TEXT DEFAULT NULL,
	phone TEXT DEFAULT NULL,
	
	pin INT DEFAULT NULL,
	string TEXT DEFAULT NULL,
	
	q1 TEXT DEFAULT NULL,
	q1a TEXT DEFAULT NULL,
	q2 TEXT DEFAULT NULL,
	q2a TEXT DEFAULT NULL,
	q3 TEXT DEFAULT NULL,
	q3a TEXT DEFAULT NULL,
	
	created TIMESTAMP DEFAULT NOW(),
	
	FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
	CHECK ((q1 IS NULL) OR (q1a IS NOT NULL)),
	CHECK ((q2 IS NULL) OR (q2a IS NOT NULL)),
	CHECK ((q3 IS NULL) OR (q3a IS NOT NULL))
		);`, (pErr2)=>{
			if (pErr2) console.log(pErr2)
			else console.log("users table CREATED")
		})
	}
})


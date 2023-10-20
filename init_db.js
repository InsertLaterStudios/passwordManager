/*
	
*/



const DATABASE = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	database: "passwordManager",
	password: process.env.DB_PASSWORD,
}



const { Pool } = require("pg")
const pool = new Pool(DATABASE)
pool.on("error", (err)=>{
	console.log("pg Pool on(\"error")
	process.exit()
})



/*
id
username
hash
session id
session hash
*/
pool.query(`CREATE TABLE IF NOT EXISTS users (
	i SERIAL PRIMARY KEY,
	
	u VARCHAR(20) UNIQUE,
	h TEXT NOT NULL,
	
	si TEXT UNIQUE,
	sh TEXT DEFAULT NULL,
	
	c TIMESTAMP DEFAULT NOW()
);`, (pErr1)=>{
	if (pErr1) console.log(pErr1)
	else {
		console.log("users table CREATED")
		/*
		user id
		
		account
		password
		
		username
		email
		phone
		
		pin
		string
		
		question 1
		answer 1
		question 2
		answer 2
		question 3
		answer 3
		
		created
		*/
		pool.query(`CREATE TABLE IF NOT EXISTS passwords (
	i SERIAL,
	ui INT,
	
	a TEXT NOT NULL,
	p TEXT NOT NULL,
	
	u TEXT DEFAULT NULL,
	e TEXT DEFAULT NULL,
	ph TEXT DEFAULT NULL,
	
	pi INT DEFAULT NULL,
	s TEXT DEFAULT NULL,
	
	q1 TEXT DEFAULT NULL,
	a1 TEXT DEFAULT NULL,
	q2 TEXT DEFAULT NULL,
	a2 TEXT DEFAULT NULL,
	q3 TEXT DEFAULT NULL,
	a3 TEXT DEFAULT NULL,
	
	c TIMESTAMP DEFAULT NOW(),
	
	FOREIGN KEY (ui) REFERENCES users (i) ON DELETE CASCADE,
	CHECK ((q1 IS NULL) OR (a1 IS NOT NULL)),
	CHECK ((q2 IS NULL) OR (a2 IS NOT NULL)),
	CHECK ((q3 IS NULL) OR (a3 IS NOT NULL))
		);`, (pErr2)=>{
			if (pErr2) console.log(pErr2)
			else console.log("users table CREATED")
		})
	}
})


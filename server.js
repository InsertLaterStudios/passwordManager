/*
	
*/

const SERVER_ADDRESS = process.env.SERVER_HOST
const SERVER_PORT = process.env.SERVER_PORT

const DATABASE = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	database: "passwordManager",
	password: process.env.DB_PASSWORD,
}

const SALT_ROUNDS = 12 // The higher the number, the more secure but slower it is





const { readFileSync } = require("fs")
const { createServer } = require("https")

const { Pool } = require("pg")
const pool = new Pool(DATABASE)
pool.on("error", (err)=>{
	console.error(err)
	process.exit()
})

const bcrypt = require('bcrypt')





const static_html = readFileSync("./templates/static/index.html")
const static_css = readFileSync("./templates/static/index.css")
const static_js = readFileSync("./templates/static/index.js")
const sCs = {
	e400: (res)=> res.writeHead(400, {"Content-Type":"html/text"}).end(`<p>400: Bad Request</p>`),
	e401: (res)=> res.writeHead(401, {}).end("Unauthorized"),
	e404: (res)=> res.writeHead(404, {"Content-Type":"html/text"}).end(`<p>404: Not Found</p>`), //
	e405: (res)=> res.writeHead(405, {"Content-Type":"html/text"}).end(`<p>405: Method Not Allowed</p>`), //
	e408: (res)=> res.writeHead(408, {}).end("Request Timeout"),
	e413: (res)=> res.writeHead(413, {}).end("413: Payload Too Large"),
	e414: (res)=> res.writeHead(414, {"Content-Type":"html/text"}).end(`<p>414: URI Too Long</p>`), //
	e415: (res)=> res.writeHead(415, {}).end("Unsupported Media Type"),
	e500: (res)=> res.writeHead(500, {"Content-Type":"html/text"}).end(`<p>500: Internal Server Error</p>`),
	e500a: (res)=> res.writeHead(500, {}).end("Internal Server Error"),
}





const pO = "!@#$%^&*(){}[]_+-.,;:1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const pOL = pO.length
function randomPassword(length){
	let out = ""
	for(let i = 0; i < length; i++){
		out += pO.charAt(Math.floor(Math.random() * pOL))
	}
	return out
}

function randomPin(length){
function parseBody(body, optionsArray, requiredArray) {
	const inArray = body.split('&')//['name=value', ...,]
	if(inArray.length != optionsArray.length) return false
	
	let outData = new Object
	
	inArray.forEach((e1)=>{
		const e1Array = e1.split('=')//['name', 'item']
		
		optionsArray.forEach((e2)=>{
			if(e2 == e1Array[0]) outData[e2] = e1Array[1]
		})
	})
	requiredArray.forEach((e2)=>{
		if(outData[e2] == null) return false
	})
	
	return outData
}
function hash(plain, callback){
	bcrypt.genSalt(SALT_ROUNDS, (sErr, salt)=>{
		if (sErr) {
			console.log("hash salt")
			callback(true)
		} 
		
		bcrypt.hash(plain, salt, (hErr, hRes)=>{
			if (hErr) {
				console.log("hash salt")
				callback(true)
			}
			callback(false, hRes)
		})
	})
}





function routeServer(req, res, path, user_id) {
	let body = ""
	let receivedData = false
	let ended = false
	
	let timedOut = false
	const timer = setTimeout(()=>{
		if (receivedData == false || ended == false) {
			timedOut = true
			sCs.e408(res)
		}
	}, 1000)
	
	req.on("error", (err)=>{return sCs.e500(res)})
	req.on("data", (chunk)=>{
		if (receivedData) return sCs.e413(res)
		receivedData = true
		
		body = chunk.toString()
		if (body.length > 1024) return sCs.e413(res)
	})
	req.on("end", ()=>{
		if (timedOut) return
		if (receivedData == false) return sCs.e400(res)
		ended = true
		
		if (user_id) { // signed
			if (req.method[0] == 'G') { // GET
				if (path[0][0] == 's' && path[0][5] == 'h') { // search
					if (user_id == false) return sCs.e401(res)
					let query = `SELECT * FROM passwords WHERE ui=${user_id} AND LOWER(a) LIKE %LOWER($1)%`
					let params = []
					pool.query(query, params, (err, res)=>{
						
					})
				}
				else sCs.e404(res)
			}
			else if (req.method[1] == 'O') { // POST
				if (path[0][0] == 'a' && path[0][2] == 'd') { // add
					if (user_id == false) return sCs.e401(res)
					let query = `SELECT * FROM passwords WHERE ui=${user_id} AND LOWER(a) LIKE %LOWER($1)%`
					let params = []
					pool.query(query, params, (err, res)=>{
						
					})
				}
				else sCs.e404(res)
			}
			else if (req.method[1] == 'U') { // PUT
				
			}
			else if (req.method[0] == 'D') { // DELETE
				
			}
			else sCs.e405(res)
		}
		else {
			if (req.method[1] == 'O') { // POST
				if (path[0][0] != 's') return sCs.e404(res)
					
				const parsed = parseBody(body, ['u', 'p'], ['u', 'p'])
				if (parsed == false) return sCs.e400(res)
				
				pool.query("SELECT h FROM users WHERE u = $1", [parsed.u], (pErr1, pRes1)=>{
					if (pErr1) {
						console.log("ERROR routeServer !user_id pool")
						return sCs.e500a(res)
					}
					
					bcrypt.compare(parsed.p, pRes1.rows[0].hash, (cErr, cRes)=> {
						if (cErr) {
							console.log("ERROR routeServer !user_id pool compare")
							return sCs.e500a(res)
						}
						
						if (cRes) {
							const id = randomPassword(20)
							const token = randomPassword(50)
							hash(token, (hErr, hRes)=>{
								if (hErr) sCs.e500a(res)
							})
							pool.query("UPDATE users SET si = $1, sh = $2 WHERE u = $3", [id, token, parsed.u], (pErr2, pRes2)=>{
								if (pErr2) {
									console.log("ERROR routeServer !user_id pool compare pool")
									return sCs.e500a(res)
								}
								
								if (pRes2.rows[0]) res.writeHead(200, {"Set-Cookie": [`id=${id}`, `t=${token}`],}).end("200")
								else sCs.e401(res)
							})
						}
						else sCs.e401(res)
					})
				})
			}
			else sCs.e405(res)
		}
	})
}

const server = createServer({
	key: readFileSync("key.pem"),
	cert: readFileSync("cert.pem")
}, (req, res)=>{
	// get path
	const path = req.url.slice(1).split('/')
	if(path.length > 2) return sCs.e414(res)
	
	// handle home
	if (path[0] == '' && req.method[0] == 'G') return res.writeHead(200, {"Content-Type":"html/text"}).end(static_html)
	
	// handle static
	if (path[0][0] == 's' && path[0][5] == 'c') { // 's'tati'c'/... || static/...
		if (path[1][6] == 'c') return res.writeHead(200, {"Content-Type":"html/text"}).end(static_css)		// static/index.css
		else if (path[1][6] == 'j') return res.writeHead(200, {"Content-Type":"html/text"}).end(static_js)	// static/index.js
		else return sCs.e404(res)
	}
	
	// handle cookies
	if(const cookie = req.headers.cookie){
		let cookies = {
			id: false,
			t: false
		}
		
		// get cookies
		const local_cookies_1 = cookie.split('; ')
		if(local_cookies_1.length != 2) return routeServer(req, res, path, false)
		for (let i = 0; i < 2; i++) {
			const local_cookies_2 = local_cookies_1[i].split('=')
			
			if (local_cookies_2[0] == "id" &&
				typeof(local_cookies_2[1]) == "string") cookies.id = local_cookies_2[1]
			else if (local_cookies_2[0] == "t" &&
				typeof(local_cookies_2[1]) == "string") cookies.t = local_cookies_2[1]
			else return routeServer(req, res, path, false)
		}
		if (cookies.id == false || cookies.t == false) return routeServer(req, res, path, false)
		
		// query cookie
		pool.query("SELECT id, hash FROM users WHERE session_id = $1;",
		[ cookies.id ],
		(pErr, pRes)=>{
			if (pErr) {
				console.log("ERROR createServer token query")
				return sCs.e500(res)
			}
			
			if (pRes.rows[0]) bcrypt.compare(cookies.t, pRes.rows[0].hash, (cErr, cRes)=> {
				if (cErr) {
					console.log("ERROR createServer token query compare")
					return sCs.e500(res)
				}
				
				if (cRes) routeServer(req, res, path, pRes.rows[0].id)
				else routeServer(req, res, path, false)
			})
		})
	}
	else routeServer(req, res, path, false)
})
server.listen(PORT, "localhost", () => {
    console.log(`server listening at https://${ADDRESS}:${PORT}`)
})


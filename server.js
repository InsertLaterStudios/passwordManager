/*
	
*/

const ADDRESS = "localhost"
const PORT = 3000

const DATABASE = {
	host: "localhost",
	port: 5432,
	user: "sammy", // REPLACE
	database: "passwordManager",
	password: process.env.DB_PASSWORD,
}

const SALT_ROUNDS = 12 // The higher the number, the more secure but slower it is





const { readFileSync } = require("fs")
const { createServer } = require("https")

const { Pool } = require("pg")
const pool = new Pool(DATABASE)
pool.on("error", (err)=>{
	console.log("pg Pool on(\"error")
	process.exit()
})

const bcrypt = require('bcrypt')





const static_html = readFileSync("./templates/static/index.html")
const static_css = readFileSync("./templates/static/index.css")
const static_js = readFileSync("./templates/static/index.js")
const sCs = {
	e400: (res)=> res.writeHead(400, {"Content-Type": "html/text"}).end("<p>400: Bad Request</p>"),
	e401: (res)=> res.writeHead(401, {"Content-Type": "html/text"}).end("<p>401: Unauthorized</p>"),
	e404: (res)=> res.writeHead(404, {"Content-Type": "html/text"}).end("<p>404: Not Found</p>"),
	e405: (res)=> res.writeHead(405, {"Content-Type": "html/text"}).end("<p>405: Method Not Allowed</p>"),
	e408: (res)=> res.writeHead(408, {"Content-Type": "html/text"}).end("<p>408: Request Timeout</p>"),
	e413: (res)=> res.writeHead(413, {"Content-Type": "html/text"}).end("<p>413: Payload Too Large</p>"),
	e414: (res)=> res.writeHead(414, {"Content-Type": "html/text"}).end("<p>414: URI Too Long</p>"),
	e415: (res)=> res.writeHead(415, {"Content-Type": "html/text"}).end("<p>415: Unsupported Media Type</p>"),
	e500: (res)=> res.writeHead(500, {"Content-Type": "html/text"}).end("<p>500: Internal Server Error</p>"),
}





function routeServer(req, res, path, user_id) {
	if (req.method == "GET") {
		
	}
	else if (req.method == "POST") {
		let body = ""
		let receivedData = false
		req.on("data", (chunk)=>{
			if (receivedData) return sCs.e413(res)
			
			body = chunk.toString()
			receivedData = true
			
			if (body.length > 1024) return sCs.e413(res)
		})
		req.on("end", ()=>{
			
		})
		req.on("error", (err)=> return sCs.e500(res))
	}
	else if (req.method == "PUT") {
		
	}
	else if (req.method == "DELETE") {
		
	}
	else return sCs.e405(res)
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
	if (path[0] == "static") { // static/...
		if (path[1][6] == 'c') return res.writeHead(200, {"Content-Type":"html/text"}).end(static_css)		// static/index.css
		else if (path[1][6] == "j") return res.writeHead(200, {"Content-Type":"html/text"}).end(static_js)	// static/index.js
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


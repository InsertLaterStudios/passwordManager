/*
	
*/

// // ENVIROMENT // //
const SERVER_PORT = process.env.SERVER_PORT



// // DEPENDENCIES // //
const { readFileSync } = require("fs")
const { createServer } = require("http")

const { web, api } = require("../aaJs/statusCodes.js")
const {
	randomString,
	parseUrl,
	parseBody, parseBodyRequired, } = require("../aaJs/authorizationHandler.js")
const { hash, compare } = require("../aaJs/hash/bcrypt.js")
const {
	pool,
	
	msqe,
	muqe,
	miqeN, miqeV, } = require("../aaJs/database/postgresql.js")



// // RESPONSES // //
const static_html = readFileSync("./templates/static/index.html")
const static_css = readFileSync("./templates/static/index.css")
const static_js = readFileSync("./templates/static/index.js")



function routeClient(req, res, path, user_id) {
	let body = ""
	let valid = true
	
	const timer = setTimeout(()=>{
		valid = false
		req.abort()
	}, 1000)
	
	req.on("error", (err)=>{
		valid = false
		web.e500(res)
	})
	req.on("data", (chunk)=>{
		if (body.length + chunk.length > 1024) sCs.e413(res)
		else body += chunk.toString()
	})
	req.on("end", ()=>{
		clearTimeout(timer)
		
		if (req.method[0] == 'G') { // GET
			if (path[0][0] == 's' && path[0][5] == 'h') { // search
				const parsed = parseBody(body, ['a', 'u', 'e', 'h', 'i'], [])
				let query = `SELECT * FROM passwords WHERE ui=$1;`
				let params = [user_id]
				pool.query(query, params, (pErr, pRes)=>{
					if (pErr) sCs.e50a(res)
					else res.writeHead(200, {}).end(JSON.stringify(pRes.rows))
				})
			}
			else sCs.e404(res)
		}
		else if (req.method[1] == 'O') { // POST
			if (path[0][0] == 'a' && path[0][2] == 'd') { // add
				const parsed = parseBody(body, ['a', 'p', 'u', 'e', 'h', 'i', 's', 'q1', 'a1', 'q2', 'a2', 'q3', 'a3'], ['a', 'p'])
				let query = `INSERT INTO passwords WHERE ui=$1 AND LOWER(a) LIKE %LOWER($1)%`
				let params = []
				pool.query(query, params, (err, res)=>{
					
				})
			}
			else sCs.e404(res)
		}
		else if (req.method[1] == 'U') { // PUT
			if (const parsed = parseBody(body, ['i', 'a', 'p', 'u', 'e', 'ph', 'n', 's', 'q1', 'a1', 'q2', 'a2', 'q3', 'a3'], ['i'])) {
				let query = ""
				let params = []
				pool.query(query, params, (pErr, pRes)=>{
					
				})
			}
		}
		else if (req.method[0] == 'D') { // DELETE
			if (const parsed = parseBody(body, ['i'], ['i'])) pool.query(
			"DELETE FROM passwords WHERE ui=$1 AND i=$2;", [user_id, parsed.i], (pErr, pRes)=>{
				if (pErr) api.e500(res)
				else res.writeHead(200, {}).end("200")
			})
			else api.e400(res)
		}
		else api.e405(res)
	})
}
function routeAnonymous(req, res, path) {
	let body = ""
	let valid = true
	
	const timer = setTimeout(()=>{
		valid = false
		req.abort()
	}, 1000)
	
	req.on("error", (err)=>{
		valid = false
		web.e500(res)
	})
	req.on("data", (chunk)=>{
		if (body.length + chunk.length > 1024) sCs.e413(res)
		else body += chunk.toString()
	})
	req.on("end", ()=>{
		clearTimeout(timer)
		
		if (req.method[1] == 'O') { // POST
			if (path[0][0] == 's') { // sign
				if (const parsed = parseBodyRequired(body, ['u', 'p'], ['u', 'p'])) pool.query(
				"SELECT h FROM users WHERE u = $1;", [parsed.u], (pErr1, pRes1)=>{
					if (pErr1) {
						console.log("ERROR routeServer !user_id pool")
						api.e500(res)
					}
					else compare(parsed.p, pRes1.rows[0].hash, (cErr, cRes)=> {
						if (cErr) {
							console.log("ERROR routeServer !user_id pool compare")
							api.e500(res)
						}
						else if (cRes) {
							const id = randomString(20)
							const t = randomString(50)
							hash(t, (hErr, hRes)=>{
								if (hErr) api.e500(res)
								else pool.query("UPDATE users SET si=$1, sh=$2 WHERE u=$3;", [id, hRes, parsed.u], (pErr2, pRes2)=>{
									if (pErr2) {
										console.log("ERROR routeServer !user_id pool compare pool")
										api.e500(res)
									}
									else if (pRes2.rows[0]) res.writeHead(200, {"Set-Cookie": [`id=${id}`, `t=${t}`],}).end("200")
									else api.e401(res)
								})
							})
						}
						else api.e401(res)
					})
				})
				else api.e400(res)
			}
			else api.e404(res)
		}
		else api.e405(res)
	})
}

const server = createServer({
	key: readFileSync("key.pem"),
	cert: readFileSync("cert.pem")
}, (req, res)=>{
	const path = parseUrl(req)
	if(path.length > 2) sCs.e414(res)
	// handle home
	else if (path[0] == '' && req.method[0] == 'G') res.writeHead(200, {"Content-Type":"html/text"}).end(static_html)
	// handle static
	else if (path[0][0] == 's' && path[0][5] == 'c') { // 's'tati'c'/... || static/...
		if (path[1][6] == 'c') res.writeHead(200, {"Content-Type":"html/text"}).end(static_css)		// static/index.css
		else if (path[1][6] == 'j') res.writeHead(200, {"Content-Type":"html/text"}).end(static_js)	// static/index.js
		else web.e404(res)
	}
	// handle cookies
	else if (req.headers.cookie && const cookies = parseCookies(req, api.e420, api.e421)){
		pool.query("SELECT id, hash FROM users WHERE session_id = $1;", [ cookies.id ], (pErr, pRes)=>{
			if (pErr) {
				console.log("ERROR createServer token query")
				api.e500(res)
			}
			else if (pRes.rows[0].hash)
			compare(cookies.t, pRes.rows[0].hash, (cErr, cRes)=> {
				if (cErr) {
					console.log("ERROR createServer token query compare")
					api.e500(res)
				}
				else if (cRes) routeClient(req, res, path, pRes.rows[0].id)
				else api.e421(res)
			})
		})
	}
	else routeAnonymous(req, res, path)
})
server.listen(SERVER_PORT, "localhost", () => {
    console.log(`server at http://localhost:${SERVER_PORT}`)
})


/*
	
*/



// // DEPENDENCIES // //
const { readFileSync } = require("fs")
const { createServer } = require("http")

const { web, api } = require("./aaJs/statusCodes.js")
const {
	randomString,
	parseUrl,
	parseBody, parseBodyRequired, } = require("./aaJs/authorizationHandler.js")
const { hash, compare } = require("./aaJs/hash/bcrypt.js")
const {
	pool,
	
	msqe,
	muqe,
	miqeN, miqeV, } = require("./aaJs/database/postgresql.js")



// // RESPONSES // //
const static_html = readFileSync("./templates/index.html").toString()
const static_css = readFileSync("./templates/static/index.css").toString()
const static_js = readFileSync("./templates/static/index.js").toString()



const bodyParams = {
	// anonymous
	sign: ['u', 'p'],
	
    search: ['a', 'u', 'e', 'ph', 'n'],
	
    add: ['a', 'p', 'u', 'e', 'ph', 'n', 's', 'q1', 'a1', 'q2', 'a2', 'q3', 'a3'],
	add_required: ['a', 'p'],
	add_loop: ['u', 'e', 'ph', 'n', 's', 'q1', 'a1', 'q2', 'a2', 'q3', 'a3'],
	
	update: ['i', 'a', 'p', 'u', 'e', 'ph', 'n', 's', 'q1', 'a1', 'q2', 'a2', 'q3', 'a3'],
	
    del: ['i'],
}
function routeClient(req, res, path, user_id) {
	let body = ""
	
	const timer = setTimeout(()=>{ req.abort() }, 5000)
	
	req.on("error", (err)=>{ web.e500(res) })
	req.on("data", (chunk)=>{
		if (body.length + chunk.length > 1024) sCs.e413(res)
		else body += chunk.toString()
	})
	req.on("end", ()=>{
		clearTimeout(timer)
		
		if (req.method[0] == 'G') { // GET
			if (path[0][0] == 's' && path[0][5] == 'h') { // search
				const parsed = parseBody(body, bodyParams.search)
				if (parsed) {
					let query = `SELECT * FROM passwords WHERE ui=$1`
					let params = [user_id]
					
					bodyParams.search.forEach((e)=>{
						if (parsed[e]) {
							params.push(parsed[e])
							query += `, $[e}=$${params.length}`
						}
					})
					query += ';'
					
					pool.query(query, params, (pErr, pRes)=>{
						if (pErr) api.e500(res)
						else res.writeHead(200, {}).end(JSON.stringify(pRes.rows))
					})
				}
				else api.e400(res)
			}
			else api.e404(res)
		}
		else if (req.method[1] == 'O') { // POST
			if (path[0][0] == 'a' && path[0][2] == 'd') { // add
				const parsed = parseBodyRequired(body, bodyParams.add, bodyParams.add_required)
				if (parsed) {
					if (Object.keys(parsed).length > 1) {
						let query = `INSERT INTO passwords (a, p`
						let queryExtension = `) VALUES ($1, $2`
						let params = [parsed.a, parsed.p]
						
						bodyParams.add_loop.forEach((e)=>{
							if (parsed[e]) {
								query += `, ${e}`
								params.push(parsed[e])
								queryExtension += `, $${params.length}`
							}
						})
						query += queryExtension + ");"
						
						pool.query(query, params, (err, res)=>{
							if (pErr) api.e500(res)
							else res.writeHead(200, {}).end("200")
						})
					}
					else api.e404(res)
				}
			}
			else api.e404(res)
		}
		else if (req.method[1] == 'U') { // PUT
			if (path[0][0] == 'u' && path[0][5] == 'e') {
				const parsed = parseBodyRequired(body, bodyParams.update, bodyParams.del)
				if (parsed) {
					if (Object.keys(parsed).length > 1) {
						let query = `UPDATE passwords SET`
						let params = []
						
						bodyParams.add.forEach((e)=>{
							if (parsed[e]) {
								params.push(parsed[e])
								query += `, ${e}=$${params.length}`
							}
						})
						params.push(parsed.i)
						query += ` WHERE i=$${params.length} AND ui=$${params.length + 1};`
						params.push(user_id)
						
						pool.query(query, params, (pErr, pRes)=>{
							if (pErr) api.e500(res)
							else res.writeHead(200, {}).end("200")
						})
					}
					else api.e400(res)
				}
				else api.e400(res)
			}
			else api.e404(res)
		}
		else if (req.method[0] == 'D') { // DELETE
			if (path[0][0] == 'd' && path[0][5] == 'e') {
				const parsed = parseBodyRequired(body, bodyParams.del, bodyParams.del)
				if (parsed) pool.query(
				"DELETE FROM passwords WHERE i=$1 AND ui=$2;", [parsed.i, user_id], (pErr, pRes)=>{
					if (pErr) api.e500(res)
					else res.writeHead(200, {}).end("200")
				})
				else api.e400(res)
			}
			else api.e404(res)
		}
		else api.e405(res)
	})
}
function routeAnonymous(req, res, path) {
	let body = ""
	let valid = true
	
	const timer = setTimeout(()=>{ req.abort() }, 5000)
	
	req.on("error", (err)=>{ web.e500(res) })
	req.on("data", (chunk)=>{
		if (body.length + chunk.length > 1024) sCs.e413(res)
		else body += chunk.toString()
	})
	req.on("end", ()=>{
		clearTimeout(timer)
		
		if (req.method[1] == 'O') { // POST
			if (path[0][0] == 's') { // sign
				const parsed = parseBodyRequired(body, bodyParams.sign, bodyParams.sign)
				if (parsed) pool.query(
				"SELECT h FROM users WHERE u = $1;", [parsed.u], (pErr1, pRes1)=>{
					if (pErr1) {
						console.log("ERROR routeServer !user_id pool")
						api.e500(res)
					}
					else if (pRes1.rows[0].hash) compare(parsed.p, pRes1.rows[0].hash, (cErr, cRes)=> {
						if (cErr) {
							console.log("ERROR routeServer !user_id pool compare")
							api.e500(res)
						}
						else if (cRes) {
							const id = randomString(25)
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
					else api.e401(res)
				})
				else api.e400(res)
			}
			else api.e404(res)
		}
		else api.e405(res)
	})
}

const server = createServer((req, res)=>{
	const path = parseUrl(req)
	console.log(path)
	if(path.length > 2) sCs.e414(res)
	// handle home
	else if (path[0] == '' && req.method[0] == 'G') {
		console.log(req.method)
		res.writeHead(200, {"Content-Type":"text/html"}).end(static_html)
	}
	// handle static
	else if (path[0][0] == 's' && path[0][5] == 'c') { // 's'tati'c'/... || static/...
		if (path[1][6] == 'c') res.writeHead(200, {"Content-Type":"html/text"}).end(static_css)		// static/index.css
		else if (path[1][6] == 'j') res.writeHead(200, {"Content-Type":"html/text"}).end(static_js)	// static/index.js
		else web.e404(res)
	}
	// handle cookies
	else if (req.headers.cookie){
		const cookies = parseCookies(req, api.e420, api.e421)
		if (cookies) pool.query("SELECT id, hash FROM users WHERE session_id = $1;", [ cookies.id ], (pErr, pRes)=>{
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
		else api.e420(res)
	}
	else routeAnonymous(req, res, path)
})
server.listen(process.env.SERVER_PORT, "localhost", () => {
    console.log(`server at http://localhost:${process.env.SERVER_PORT}`)
})


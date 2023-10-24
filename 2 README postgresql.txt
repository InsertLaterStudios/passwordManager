


Be in console as sammy
	If not, go to "1 README hosting.txt"

Execute all lines replacing:
	airanon
	sammy
	your_password

sudo apt-get update
sudo apt-get install postgresql
systemctl status postgresql
sudo systemctl enable postgresql
sudo -i -u postgres
psql
CREATE DATABASE airanon;
CREATE USER sammy WITH PASSWORD 'your_password';
\q
psql -d airanon
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO sammy;
CREATE TABLE IF NOT EXISTS users (
	i SERIAL PRIMARY KEY,

	u VARCHAR(20) UNIQUE,
	h TEXT NOT NULL,

	si VARCHAR(25) UNIQUE,
	sh TEXT DEFAULT NULL,

	c TIMESTAMP DEFAULT NOW());
CREATE TABLE IF NOT EXISTS passwords (
	i SERIAL,
	ui INT,

	a TEXT NOT NULL,
	p TEXT NOT NULL,

	u TEXT DEFAULT NULL,
	e TEXT DEFAULT NULL,
	ph TEXT DEFAULT NULL,

	n INT DEFAULT NULL,
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
	CHECK ((q3 IS NULL) OR (a3 IS NOT NULL)));
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO sammy;
GRANT SELECT, INSERT, UPDATE, DELETE ON passwords TO sammy;
\q
exit





Be in console as sammy
	If not, go to "1 README hosting.txt"

Execute all lines replacing:
	passwordManager
	sammy
	your_password

sudo apt-get update
sudo apt-get install postgresql
systemctl status postgresql
sudo systemctl enable postgresql
sudo -i -u postgres
psql
CREATE DATABASE passwordManager;
CREATE USER sammy WITH PASSWORD "your_password";
\q
exit

sudo mkdir -p /etc/postgresql/13/main/ssl
sudo openssl req -x509 -nodes -newkey rsa:4096 -keyout /etc/postgresql/13/main/ssl/postgresql.key -out /etc/postgresql/13/main/ssl/postgresql.crt
sudo chmod 600 /etc/postgresql/13/main/ssl/postgresql.key
sudo chmod 644 /etc/postgresql/13/main/ssl/postgresql.crt
sudo chown -R postgres:postgres /etc/postgresql/13/main/ssl
sudo nano /etc/postgresql/13/main/postgresql.conf

ssl = on
ssl_cert_file = '/etc/postgresql/13/main/ssl/postgresql.crt'
ssl_key_file = '/etc/postgresql/13/main/ssl/postgresql.key'

sudo systemctl restart postgresql

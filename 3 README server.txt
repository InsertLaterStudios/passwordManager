


1. NginX
Execute all lines replacing:
	example.com

sudo apt update
sudo apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx HTTP'
sudo ufw status
systemctl status nginx
sudo nano /etc/nginx/sites-available/example.com	# add the nginx code from below into file
sudo nginx -t
sudo systemctl restart nginx

# some helpful commands
sudo systemctl stop nginx
sudo systemctl start nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl disable nginx
sudo systemctl enable nginx

# use this in /etc/nginx/sites-available/... replacing:
	example.com
	www.example.com
	3000
	example.crt
	example.key

server {
	listen 443 ssl;
	server_name example.com www.example.com;

	proxy_pass localhost:3000;
	
	ssl_certificate /etc/nginx/ssl/example.crt;
	ssl_certificate_key /etc/nginx/ssl/example.key;
}



2. Certbot TLS/SSL Renewal
Execute all lines replacing:
	example.com
	www.example.com

sudo snap install core; sudo snap refresh core
sudo apt remove certbot
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx -d example.com -d www.example.com
sudo systemctl status snap.certbot.renew.service
sudo certbot renew --dry-run



3. Node.js
Execute all lines replacing:
	sdadasd
	asdadsdasdsad

sudo apt update
sudo apt install nodejs
sudo node -v
sudo apt install npm
sudo npm init -y
sudo npm install fs https pg bcrypt



5. passwordManager
Execute all lines replacing:
	your_database_password

sudo node init_db.js DB_PASSWORD=your_database_password


5. PM2
Execute all lines replacing:
	your_database_password
	sammy

sudo npm install pm2@latest -g
pm2 start server.js DB_PASSWORD=your_database_password

#use this to copy a command that youll use
pm2 startup systemd
EXAMPLE output
	[PM2] Init System found: systemd
	sammy
	[PM2] To setup the Startup Script, copy/paste the following command:
	sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u sammy --hp /home/sammy

pm2 save
sudo systemctl start pm2-sammy
systemctl status pm2-sammy

#helpful pm2 commands replacing: (get these from "pm2 list")
	app_name_or_id
	app_name
pm2 monit
pm2 list
pm2 stop app_name_or_id
pm2 restart app_name_or_id
pm2 info app_name


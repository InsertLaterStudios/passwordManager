


Be in console as sammy
	If not, go to "1 README hosting.txt"



1. NginX
Execute all lines replacing:
	example.com

sudo apt update
sudo apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx Full'
sudo ufw status
systemctl status nginx
sudo nano /etc/nginx/sites-available/example.com	# copy the nginx code from below into file
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo nano /etc/nginx/nginx.conf
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


limit_req_zonec$binary_remote_addr zone=mylimit:10m rate=1r/s;

server {
	listen 80;
        listen [::]:80;
	server_name example.com www.example.com;

	location / {
		limit_req zone=mylimit burst=2 nodelay;
		
		proxy_pass http://localhost:3000;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
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
Execute all lines:

sudo apt update
sudo apt install nodejs
sudo node -v
sudo apt install npm



4.GitHub
git clone https://github.com/InsertLaterStudios/passwordManager.git
cd passwordManager
git clone https://github.com/InsertLaterStudios/aaJs.git
sudo npm init -y
sudo npm install fs https pg bcrypt



5. PM2
Execute all lines replacing:
	sammy

sudo npm install pm2@latest -g
pm2 start pm.js

pm2 startup systemd		# use this command to copy a command to use
EXAMPLE output
	[PM2] Init System found: systemd
	sammy
	[PM2] To setup the Startup Script, copy/paste the following command:
	sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u sammy --hp /home/sammy

pm2 save
sudo reboot # WAIT!!! this is a possible command if pm2 keeps shutting down
sudo systemctl start pm2-sammy
systemctl status pm2-sammy

# helpful pm2 commands replacing: (get these from "pm2 list")
	app_name_or_id
	app_name
pm2 list
pm2 monit
pm2 stop app_name_or_id
pm2 restart app_name_or_id
pm2 info app_name



6. passwordManager
Execute all lines replacing:
	3000
	localhost
	5432
	sammy
	airanon
	your_database_password

export SERVER_PORT=3000
export PG_HOST=localhost
export PG_PORT=5432
export PG_USER=sammy
export PG_DATABASE=airanon
export PG_PASSWORD=your_database_password
pm2 restart all --update-env

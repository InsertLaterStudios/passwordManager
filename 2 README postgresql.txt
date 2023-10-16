


Be in console as sammy
	If not, go to "1 README hosting.txt"

Execute all lines replacing:
	sammy
	your_password

sudo apt-get update
sudo apt-get install postgresql
systemctl status postgresql
sudo systemctl enable postgresql
sudo -i -u postgres
psql
CREATE DATABASE passwordManager;
CREATE USER sammy WITH PASSWORD 'your_password';
exit


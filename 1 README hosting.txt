


Go to whatever site for cpu hosting.
	ex. https://www.digitalocean.com/ *not a sponsor*

Sign in and setup your account.

Create the digitalocean "droplet" equivelant of a cpu or process.
	Usually able to select:
		Region
		Datacenter (subsection of a regions server architecture, not really relevant)
		OS Image (Ubuntu will be used in all examples)
		Procesing Power / Number of CPUs for Price
		SSH or Password (SSH more secure), (i choose to disable OpenSSH and access through the website)
		Optional Free or Paid add-ons


Access the created droplets console as root
	add digitalocean helpfull example ////////////////////////////////////////////////////////////////////////////////////////

Execute all lines replacing:
	sammy
	your_server_ip

adduser sammy
usermod -aG sudo sammy
ufw app list
ufw delete OpenSSH
ufw enable
ufw status
su sammy


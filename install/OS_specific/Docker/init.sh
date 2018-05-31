#!/bin/bash
echo 'Start init'

if ! [ -f /.dockerinit ]; then
	touch /.dockerinit
	chmod 755 /.dockerinit
fi

if [ -z ${ROOT_PASSWORD} ]; then
	ROOT_PASSWORD=$(cat /dev/urandom | tr -cd 'a-f0-9' | head -c 20)
	echo "Use generate password : ${ROOT_PASSWORD}"
fi

echo "root:${ROOT_PASSWORD}" | chpasswd

if [ ! -z ${APACHE_PORT} ]; then
	echo 'Change apache listen port to : '${APACHE_PORT}
	echo "Listen ${APACHE_PORT}" > /etc/apache2/ports.conf
	sed -i -E "s/\<VirtualHost \*:(.*)\>/VirtualHost \*:${APACHE_PORT}/" /etc/apache2/sites-enabled/000-default.conf
fi	

if [ ! -z ${SSH_PORT} ]; then
	echo 'Change SSH listen port to : '${APACHE_PORT}
	sed '/Port /d' /etc/ssh/sshd_config
	echo "Port ${SSH_PORT}" >> /etc/ssh/sshd_config
fi

if [ ! -z ${MODE_HOST} ] && [ ${MODE_HOST} -eq 1 ]; then
	echo 'Update /etc/hosts for host mode'
	echo "127.0.0.1 localhost nextdom" > /etc/hosts
fi

if [ -f /var/www/html/core/config/common.config.php ]; then
	echo 'NextDom is already install'
else
	echo 'Start nextdom installation'
	rm -rf /root/install.sh
	wget https://raw.githubusercontent.com/nextdom/core/stable/install/install.sh -O /root/install.sh
	chmod +x /root/install.sh
	/root/install.sh -s 6
fi

echo 'All init complete'
chmod 777 /dev/tty*
chmod 777 -R /tmp
chmod 755 -R /var/www/html
chown -R www-data:www-data /var/www/html

echo 'Start apache2'
systemctl restart apache2

echo 'Start sshd'
systemctl restart sshd

/usr/bin/supervisord

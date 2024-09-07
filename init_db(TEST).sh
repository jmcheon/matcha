#!/bin/bash

echo "Running init_db.sh script..."
ls -l /docker-entrypoint-initdb.d  # List files in the directory to check permissions

# Check and set permissions if needed
chmod +w /docker-entrypoint-initdb.d

# Read environment variables
MYSQL_USER=${MYSQL_USER}
MYSQL_PASSWORD=${MYSQL_PASSWORD}
BACK_HOST=back  # Use service name directly

# Create SQL commands using environment variables
echo "GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'${BACK_HOST}' WITH GRANT OPTION;" > /docker-entrypoint-initdb.d/init.sql
echo "FLUSH PRIVILEGES;" >> /docker-entrypoint-initdb.d/init.sql

echo "init.sql has been created with the following content:"
cat /docker-entrypoint-initdb.d/init.sql

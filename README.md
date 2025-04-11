# AURA VINDEX (FOR MOBILE VERSION)
**AURA VINDEX** is a mobile application designed to streamline library management. It provides tools for libraries to efficiently handle:
- Books: Catalog and manage book inventory.
- Book Loans: Simplify the process of lending and returning books.
- Suscriptions: The mobile app requires a suscription plan in order to use.

This application offers a user-friendly interface for both administrators and library users, with robust authentication, role-based authorization, and CRUD functionality to meet modern library needs.

## AURA VINDEX API
This repository contains the backend API for the **AURA VINDEX** application. The backend is responsible for handling all server-side operations, including:
- Managing user authentication and role-based authorization.
- Providing RESTful endpoints for books, suscriptions and book loans.
- Enabling CRUD functionality for library resources.
- Interfacing with the database to store and retrieve data efficiently.
- The backend is built with Node.js and Express, using MongoDB as the database. It is fully containerized with Docker for seamless deployment, ensuring scalability and easy maintenance.

This API serves as the core of the **AURA VINDEX** system, providing all the necessary functionality for the frontend to deliver a smooth user experience.

You can access our API on [https://api.auravindex.me/v1/](https://api.auravindex.me/v1/)

## Contents
1. [Installation](#installation)
2. [Documentation](#documentation)
4. [Environment Variables](#environment-variables)
5. [Deployment](#deployment)
6. [License](https://github.com/UCASV/programaci-n-web-0-2024-proyecto-backend-elektro?tab=GPL-3.0-1-ov-file#readme)

## Installation
Follow these steps to set up and run the project locally:
1. Prerequisites:
    - Docker (to run the server and database motor)
    - Docker Compose (for orchestrating the containers)
2. Clone the repository with Git or download the project from GitHub.
3. Set up the environment variables. Create an `.env` file or rename the `example.env` file from the repository. Set up the your variables, read more in the [Environment Variables](#environment-variables) section.
4. When you are running the container for the first time, you need to create the database and an admin user for that database (which will be used for the server connection), run `docker compose up mongodb -d` to only deploy the MongoDB database.
5. Run `docker compose exec -it mongodb mongosh "mongodb://root_user:root_password@localhost:mongodb_port"` to connect to the database and access the MongoDB command line.
6. Run `use DATABASE_NAME` to create a database with that name. Then create an username for that database: `db.createUser({user: 'username', pwd: 'password', roles: ["readWrite"]})`. Run `exit` to exit the MongoDB command line.
4. Run the application using Docker Compose. First run `docker compose up --build` and once it's done verify if the containers are running by executing the command `docker ps -a`
5. To access the application you can check on http://localhost:3000 (or the port set in the `.env` file).
6. If you have issues with the server, you can check docker compose logs to look for errors; you can verify if the `.env` file has the correct configurations.
## Documentation
You can read the API documentation on [Bump.sh](https://bump.sh/elektro/doc/auravindex/).
## Environment variables
In this section you'll understand what each environment variable is used for.
```bash
# The URI to connect to the MongoDB database.
MONGODB_URI=mongodb://adminUsername:adminPassword@service_name:port/database_name
# URI to connect to the MongoDB Shell
MONGODB_URI_SHELL=mongodb://rootUsername:rootPassword@localhost:27017/
# The port that will be used to listen to when running the server.
SERVER_PORT=3000
# The JWT secret is a secret key used to sign and verify JSON Web Tokens (JWT).
JWT_SECRET=example
# Main app domain
APP_MAIN_DOMAIN=example.com
# Admin gmail email and app password (This is used to send the reset password links to emails)
ADMIN_GMAIL_EMAIL=example@gmail.com
ADMIN_GMAIL_PASSWORD=appPasswordExample
# The support email where users can contact for support
APP_SUPPORT_EMAIL=example@gmail.com
# This options tells the server if users can request the server to import default data (they cannot access this data).
ALLOW_IMPORTING_DEFAULT_DATA=true
# When requesting the server to import default data, you can set up the credentials for the default admin user.
APP_ADMIN_EMAIL=example@gmail.com
APP_ADMIN_PASSWORD=securePassword1234
# MongoDB default data
MONGO_INITDB_ROOT_USERNAME=rootUsername
MONGO_INITDB_ROOT_PASSWORD=rootPassword
#MONGO_INITDB_DATABASE=AURAVINDEX
# Mongo Express default data
ME_CONFIG_MONGODB_ADMINUSERNAME=rootUsername
ME_CONFIG_MONGODB_ADMINPASSWORD=rootPassword
ME_CONFIG_MONGODB_URL=mongodb://rootUsername:rootPassword@service_name:27017/?authSource=admin
# Require authentication to access Mongo Express
ME_CONFIG_BASICAUTH_ENABLED=true
ME_CONFIG_BASICAUTH_USERNAME=mongo_express_username
ME_CONFIG_BASICAUTH_PASSWORD=mongo_express_password
# Mongo Express default port
ME_CONFIG_PORT=8081
```
## Deployment
In this section we'll explain how to deploy the server to the cloud. We'll use Digital Ocean. 
1. First we need to create a Droplet in Digital Ocean, read the official documentation [here](https://docs.digitalocean.com/products/droplets/). Once we have created the Droplet, we'll copy the IP.
2. Then we need to install Nginx and Docker (Documentation [here](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)) on the Droplet we've created. 
3. Clone the repository from GitHub, set up the server as explained in [Installation](#installation). 
4. Set up Nginx as proxy: `sudo nano /etc/nginx/sites-available/api` and add:
```bash
server {
    listen 80;
    server_name <DIGITAL_OCEAN_IP>;

    location / {
        proxy_pass http://localhost:<SERVER_PORT>; # The port that the server listens to
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
5. Then run `sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/` to save and activate the proxy. Finally, restart nginx with `sudo systemctl restart nginx`. After this you should be able to access the API in the IP from Digital Ocean.
#### Making changes after deploying
If you made changes to the server and need to deploy those changes, you can follow these steps:
1. If you made the changes in the repository, use `git pull` to pull the changes from GitHub.
2. Rebuild the image to include the changes, run `docker compose build`. 
3. Restart the containers, run `docker compose down` and then `docker compose up --build -d`. Verify if the containers are running with `docker ps -a`. 
4. If you want to remove the old image, you can run `docker image prune`. This step is optional.
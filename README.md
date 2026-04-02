# Docker Social Media App

A full-stack social media platform built with Docker, featuring user authentication, posts, and a dynamic web interface. This project started as a Docker study exercise to understand containerization with a CRUD API, database, and proxy setup, and has evolved into a complete social media application.

## 🏗️ Architecture

The application consists of four main services:

- **API**: Node.js REST API handling business logic
- **Database**: Persistent data storage for users and posts
- **Proxy**: Nginx reverse proxy for routing requests
- **Web Client**: Dynamic web page for user interaction

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed on your machine
- No local services running on ports 8080 or adjust the compose file

### Running the Application

```bash
# Full rebuild and start (recommended for first run)
sudo docker compose down -v && sudo docker compose up --build

docker compose down -v && docker compose up --build
```

The `-v` flag removes volumes, ensuring a clean database state. Remove it if you want to persist data between runs.

### Access the Application

- **Web Interface**: `http://localhost:8080/`
- **API Endpoints**: `http://localhost:8080/api`
- **Database**: Available internally to the API service only

## 📁 Project Structure

```
docker-node-app/
├── api/               # Node.js API service
├── .env               # Enviroment variables, for Docker and the API
├── docker-compose.yml # Compose
├── Dockerfile         # Dockerfile to build node image
├── init.sql           # Script to init the database
└── nginx.conf         # Nginx proxy configuration
```

## 🔧 Development

To work on individual services:

```bash
# Rebuild a specific service
docker compose build api

# View logs
docker compose logs -f

# Access a service shell
docker compose exec api sh
```

## 🛑 Stopping the Application

```bash
# Stop containers (preserves data)
docker compose down

# Stop and remove volumes (clears database)
docker compose down -v
```

## 🎯 Features

- ✅ User registration and authentication
- ✅ Create, read, update, and delete posts
- ✅ Dynamic web interface
- ✅ Reverse proxy configuration
- ✅ Persistent database storage

## 🔒 Security

- Database runs on an isolated internal network with no external access
- Only Nginx proxy is exposed to the host machine
- Environment variables manage sensitive configuration

## 📚 Learning Outcomes

This project helped me understand:

- Docker containerization and orchestration
- Security by desing principles and how to do it
- Multi-service application architecture
- Nginx reverse proxy configuration
- Database integration with Node.js
- Full-stack development principles

## 🤝 Contributing

This is a personal study project, but feel free to fork and experiment!

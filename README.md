# Fantasy Space Task

A **NestJS** backend project connected to a **MySQL** database using **Docker** and **Docker Compose**.

---

## Features

- NestJS backend with Prisma ORM
- MySQL database for data persistence
- Dockerized environment for simple setup and deployment
- Middleware for rate limiting, validation, and basic logging
- Modular and clean architecture with services for Auth, Courses, Q&A, etc.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (only if running without Docker)

---

## Getting Started

### 1. Configure environment variables
Create a .env file in the project root (or copy from .env.example) with the following variables:

Note: When running with Docker Compose, the MySQL hostname should be mysql as it matches the service name in docker-compose.yml.

### 2. Run with Docker Compose
Build and start the containers:

`docker compose up --build`

Build the NestJS application image

Pull and start the MySQL container

Run both containers on a shared Docker network

### 3. Access the application
Backend API available at: http://localhost:3000

MySQL accessible on port 4567 (username: root, password: examplepassword)

Running Locally (Without Docker)
If you prefer to run the application directly on your machine:

Install dependencies

`npm install`

Set up your .env file with database connection details pointing to your local or remote MySQL server.

Generate Prisma client and run migrations

`npx prisma generate`
`npx prisma migrate deploy`

Start the app in development mode

`npm run start:dev`
On macOS, verify that Docker Desktop is running properly if you encounter daemon-related issues.

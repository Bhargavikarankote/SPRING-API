# Simple Java REST API Demo

This is a simple Spring Boot application managing a collection of items in-memory.

## Prerequisites

- Java 17+
- Maven (optional, wrapper/helper included if you use `mvnw` but I used standard `mvn`)
- Docker (for containerization)

## Running Locally

1. **Clone/Navigate** to the project directory.
2. **Run** directly with Maven:
   ```bash
   mvn spring-boot:run
   ```
   The application will start on `http://localhost:8080`.

## API Endpoints

### 1. Add a new item

**POST** `/items`

Request Body (`application/json`):
```json
{
  "name": "Inception",
  "description": "A mind-bending thriller",
  "price": 19.99
}
```

Response: 201 Created

### 2. Get all items

**GET** `/items`

Response: 200 OK

### 3. Get item by ID

**GET** `/items/{id}`

Response: 200 OK or 404 Not Found

## Deployment (Docker)

This application is container-ready.

1. **Build the image**:
   ```bash
   docker build -t java-demo-api .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8080:8080 java-demo-api
   ```

## Input Validation

The application validates input:
- `name`: Required, 2-100 chars.
- `description`: Max 500 chars.
- `price`: Required, non-negative.

Try sending an invalid request to see the error messages!

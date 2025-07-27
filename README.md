RetailFlow - Cloud-Native Product Lifecycle Management System
A foundational cloud-native Product Lifecycle Management (PLM) service designed specifically for fashion retailers. This project demonstrates practical experience with a modern tech stack, covering both backend and frontend development, alongside cloud infrastructure deployment.

✨ Features
Core Product Management: Create, view, and manage product details.

Lifecycle Status Tracking: Advance products through various stages (e.g., DESIGN, PROTOTYPE, APPROVED).

User Authentication & Authorization: Secure user registration and login with role-based access (e.g., ROLE_DESIGNER).

Cloud-Native Architecture: Built for scalability and resilience using AWS services.

RESTful API: A well-defined API for seamless interaction with product and user data.

🛠️ Technologies Used
Backend
Java: Core programming language.

Spring Boot: Framework for building robust, stand-alone, production-grade Spring applications.

Maven: Build automation tool.

PostgreSQL: Relational database for product data persistence.

Frontend
HTML5: Structure of the web application.

JavaScript: Interactive client-side logic.

CSS: Styling and presentation (though minimal in this basic setup).

Cloud Infrastructure
AWS EC2: Virtual servers for hosting the backend application.

AWS S3: Scalable storage for static frontend assets.

AWS RDS: Managed PostgreSQL database service.

AWS CloudWatch: Monitoring and logging for application health and metrics.

🏗️ Architecture Overview
RetailFlow leverages a classic three-tier cloud-native architecture for high availability and scalability.

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     Frontend    │       │     Backend     │       │     Database    │
│   (AWS S3)      │◄─────►│   (AWS EC2)     │◄─────►│  (AWS RDS)      │
│   HTML/JS       │       │   Java/Spring   │       │   PostgreSQL    │
│   Static Assets │       │   RESTful API   │       │   Product Data  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                         ┌─────────────────┐
                         │    Monitoring   │
                         │  (CloudWatch)   │
                         │  Logs & Metrics │
                         └─────────────────┘

🚀 Quick Start
Local Development
Get RetailFlow running on your local machine with these simple steps.

Clone Repository:

git clone <repository-url> # Replace with your GitHub repository URL
cd retailflow-plm

Database Setup:

Ensure PostgreSQL is running locally.

Create a database named retailflow_plm and a user named plm_user.

Troubleshooting Note: If you encounter database connection issues, you may need to recreate the database or set an admin password for plm_user that matches your Spring Boot configuration (usually defined in application-dev.properties).

Build & Run Backend:

# Build the project
mvn clean install

# Run the Spring Boot application in development profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

The backend will start on http://localhost:8080.

Access Frontend:
Open the frontend/index.html file directly in your web browser.

AWS Deployment
Deploy your RetailFlow instance directly to AWS.

Configure AWS CLI:
Ensure you have the AWS CLI installed and configured with appropriate credentials.

aws configure

Deploy Infrastructure & Application:
Execute the deployment script, providing your EC2 host, SSH key file, and desired S3 bucket name.

./scripts/deploy.sh <EC2_HOST> <KEY_FILE> <S3_BUCKET_NAME>

📋 API Documentation
The backend exposes a comprehensive RESTful API for managing products and users.
Base URL: http://localhost:8080/api

Authentication & User Management Endpoints (/api/auth)
These endpoints handle user registration and authentication.

1. Register New User
Endpoint: POST /api/auth/register

Description: Creates a new user with a specified role.

Request Body (JSON):

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "securepassword",
  "role": "ROLE_DESIGNER"
}

Responses:

201 Created: On success.

400 Bad Request: If username/email already exists.

2. User Login
Endpoint: POST /api/auth/login

Description: Authenticates a user and simulates a successful login. (Future: Returns JWT token).

Request Body (JSON):

{
  "username": "user_username",
  "password": "user_password"
}

Responses:

200 OK: On success.

401 Unauthorized: On invalid credentials.

3. Get Authenticated User Details
Endpoint: GET /api/auth/users/me

Description: Returns details about the currently authenticated user.

Authentication: Basic Auth (e.g., Username: admin, Password: password)

Responses:

200 OK: With user details.

401 Unauthorized: If not authenticated.

Product Management Endpoints (/api/products)
These endpoints manage the product lifecycle.

1. Get All Products
Endpoint: GET /api/products

Description: Retrieves a list of all products in the system.

Responses:

200 OK: With List<Product>.

2. Create New Product
Endpoint: POST /api/products

Description: Adds a new product to the system.

Request Body (JSON):

{
  "productId": "PRD-XYZ",
  "name": "New Product Name",
  "description": "Description of the new product",
  "category": "Apparel"
}

Responses:

201 Created: With the created Product object.

3. Get Product by ID
Endpoint: GET /api/products/{id}

Description: Retrieves a single product by its database ID.

Path Variable: {id} (e.g., 1, 25)

Responses:

200 OK: With Product object.

404 Not Found: If ID does not exist.

4. Update Product Status
Endpoint: PUT /api/products/{id}/status

Description: Advances a product's lifecycle status (e.g., from DESIGN to PROTOTYPE).

Path Variable: {id}

Request Body (JSON):

{
  "status": "PROTOTYPE"
}

Responses:

200 OK: With updated Product object.

400 Bad Request: If status is invalid.

404 Not Found: If product ID does not exist.

5. Get Products by Status
Endpoint: GET /api/products/status/{status}

Description: Retrieves products filtered by a specific lifecycle status.

Path Variable: {status} (e.g., DESIGN, PROTOTYPE, APPROVED)

Responses:

200 OK: With List<Product> matching the status.

✅ Testing
Ensure the application is robust with these testing commands.

Run Unit Tests:

mvn test

Run Integration Tests:

./scripts/integration-test.sh

Generate Test Coverage Report:

mvn jacoco:report

🔍 Monitoring and Observability
RetailFlow includes built-in endpoints and cloud integration for monitoring.

Local Endpoints (Spring Boot Actuator)
Application Health: GET http://localhost:8080/actuator/health

Application Info: GET http://localhost:8080/actuator/info

Metrics: GET http://localhost:8080/actuator/metrics

Cloud Integration
CloudWatch: Logs and custom metrics are integrated for deployed AWS instances, providing insights into application performance and issues.

🚀 Future Enhancements
We envision expanding RetailFlow with the following capabilities:

Technical Improvements
JWT-based Authentication: Replace basic auth with JSON Web Tokens for more secure and scalable authentication.

Caching (Redis): Implement a caching layer to improve API response times and reduce database load.

Advanced Search (Elasticsearch): Integrate Elasticsearch for powerful, full-text search capabilities across product data.

File Storage (AWS S3): Manage product-related files (e.g., design sketches, material swatches) directly in S3.

Business Features
Workflow Engine: Implement a robust workflow engine to define and manage custom product lifecycle stages.

Version Control: Track changes and maintain historical versions of product data.

Collaboration Tools: Add features for teams to collaborate on product development.

Advanced Analytics: Provide deeper insights into product performance and lifecycle bottlenecks.

ERP/CRM Integrations: Connect with enterprise resource planning and customer relationship management systems.

DevOps Enhancements
Blue-Green Deployment: Implement strategies for zero-downtime deployments.

Auto-scaling: Automatically adjust backend capacity based on demand.

Load Balancing: Distribute incoming traffic across multiple instances for improved resilience and performance.

Automated Backups: Ensure regular and reliable backups of all critical data.

Disaster Recovery: Develop strategies to recover from major outages.



📝 License
This project is licensed under the MIT License.

Built with ❤️ for demonstrating Cloud Application Engineering skills.
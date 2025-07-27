
# RetailFlow - Cloud-Native Product Lifecycle Management System
A foundational cloud-native Product Lifecycle Management (PLM) service designed specifically for fashion retailers. This project demonstrates practical experience with a modern tech stack, covering both backend and frontend development, alongside cloud infrastructure deployment.


## Features Core Product Management: Create, view, and manage product details.

- Lifecycle Status Tracking: Advance products through various stages (e.g., DESIGN, PROTOTYPE, APPROVED).

- User Authentication & Authorization: Secure user registration and login with role-based access (e.g., ROLE_DESIGNER).

- Cloud-Native Architecture: Built for scalability and resilience using AWS services.

- RESTful API: A well-defined API for seamless interaction with product and user data.

## Tech Stack 

**Frontend:** HTML5, JavaScript, CSS

**Backend**
- Server: Spring Boot, Maven
- Database: PostgreSQL

**Cloud Infrastructure**
- Compute: AWS EC2
- Storage: AWS S3
- Database: AWS RDS (PostgreSQL)
- Monitoring: AWS CloudWatch
## All API Endpoints

#### Authentication & User Management
- POST /api/auth/register — Register a new user

- POST /api/auth/login — User login

- GET /api/auth/users/me — Get authenticated user details

#### Product Management
- GET /api/products — Get all products

- POST /api/products — Create a new product

- GET /api/products/{id} — Get product by ID

- PUT /api/products/{id}/status — Update product status

- GET /api/products/status/{status} — Get products by status


## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Run Unit Tests:

- mvn test

- Run Integration Tests : ./scripts/integration-test.sh

#### Generate Test Coverage Report:

- mvn jacoco:report

- Monitoring and Observability RetailFlow includes built-in endpoints and cloud integration for monitoring.

- Local Endpoints (Spring Boot Actuator) Application Health: GET http://localhost:8080/actuator/health

- Application Info: GET http://localhost:8080/actuator/info

- Metrics: GET http://localhost:8080/actuator/metr

#### Built with ❤️ for demonstrating Cloud Application Engineering skills.

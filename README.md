# Employee Management System

A full-stack web application for managing employees, built with Spring Boot and React.

## Features

- User Authentication and Authorization
- Employee Management
- Document Management
- Task Management
- Appointment Scheduling
- Customer Management
- Role-based Access Control (Admin, Employee, Customer)

## Tech Stack

### Backend

- Java 17
- Spring Boot 3.1.1
- Spring Security
- Spring Data JPA
- H2 Database
- Maven

### Frontend

- React
- React Router
- Axios
- Bootstrap
- Font Awesome

## Project Structure

```
Employee-Management-System/
├── fullstack-backend/         # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/        # Java source code
│   │   │   └── resources/   # Configuration files
│   │   └── test/            # Test files
│   ├── .gitignore           # Backend specific gitignore
│   └── pom.xml              # Maven configuration
│
└── Employee-Management-Frontend/  # React frontend
    ├── src/
    │   ├── auth/            # Authentication components
    │   ├── components/      # Reusable components
    │   ├── context/         # React context
    │   ├── modules/         # Feature modules
    │   └── pages/           # Page components
    ├── .gitignore           # Frontend specific gitignore
    └── package.json         # NPM configuration
```

## Git Configuration

The project includes three `.gitignore` files:

1. Root `.gitignore`: Common files and directories to ignore
2. Backend `.gitignore`: Spring Boot specific files

   - Compiled Java files
   - Maven build files
   - IDE specific files
   - Application properties (except main)
   - Log files

3. Frontend `.gitignore`: React specific files
   - Node modules
   - Build outputs
   - Environment files
   - IDE specific files
   - Log files

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 14 or higher
- Maven
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd fullstack-backend
   ```
2. Build the project:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Employee-Management-Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

The backend API runs on `http://localhost:8080`. Here are the main endpoints:

### Authentication

- POST `/auth/login` - User login
- POST `/auth/register` - User registration

### User Management

- GET `/users` - Get all users
- GET `/user/{id}` - Get user by ID
- POST `/user` - Create new user
- PUT `/user/{id}` - Update user
- DELETE `/user/{id}` - Delete user

### Document Management

- GET `/documents` - Get all documents
- POST `/documents` - Upload new document
- GET `/documents/{id}` - Get document by ID
- PUT `/documents/{id}` - Update document
- DELETE `/documents/{id}` - Delete document

## Security

The application implements:

- JWT-based authentication
- Role-based access control
- Password encryption
- CSRF protection
- CORS configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact the project maintainers.

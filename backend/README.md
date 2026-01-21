# Luminote Backend

A robust Node.js backend API for the Luminote note-taking application, built with Express, MongoDB, and JWT authentication. This API provides secure user authentication and comprehensive note management functionality.

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Models](#models)
- [Middleware](#middleware)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Security](#security)

## ✨ Features

- **User Authentication System**
  - Registration with email verification
  - Secure login/logout functionality
  - JWT-based session management
  - Password reset via OTP (One-Time Password)

- **Note Management**
  - Create, read, update, and delete notes
  - Note categorization and tagging
  - Pin/unpin important notes
  - Soft delete for data recovery
  - Filtering and sorting capabilities

- **Security Features**
  - Bcrypt password hashing
  - JWT token authentication
  - Input validation and sanitization
  - CORS protection
  - Cookie security with HttpOnly and SameSite flags

- **Additional Features**
  - Structured logging with Pino
  - Email notifications for password resets
  - Comprehensive error handling
  - Database indexing for performance

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime environment
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token for authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending functionality
- **Pino** - Fast logger for Node.js
- **Cors** - Cross-Origin Resource Sharing middleware
- **Dotenv** - Environment variable management
- **Express-validator** - Request validation

## 📁 Directory Structure

```
backend/
├── config/
│   └── db.js                 # Database connection configuration
├── controllers/
│   ├── authControllers.js    # Authentication business logic
│   └── noteControllers.js    # Note management business logic
├── middleware/
│   └── protectedRoutes.js    # Authentication middleware
├── models/
│   ├── NoteModel.js          # Note schema definition
│   └── UserModel.js          # User schema definition
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   └── noteRoutes.js         # Note management routes
├── tests/
│   ├── test.auth.js          # Authentication tests
│   └── test.note.js          # Note management tests
├── .env                      # Environment variables (not committed)
├── .gitignore                # Git ignore configuration
├── index.js                  # Main application entry point
├── package.json              # Project dependencies and scripts
└── README.md                 # Documentation (this file)
```

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables) section).

4. **Start the development server**
```bash
npm run dev
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Node Environment
NODE_ENV=development
```

## 🌐 API Endpoints

### Authentication Routes (`/api/auth`)

#### Public Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP

#### Protected Routes (require authentication)
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user data

### Note Routes (`/api/note`)

#### Protected Routes (require authentication)
- `POST /api/note/create` - Create a new note
- `GET /api/note/` - Get all user's notes (with optional filters)
- `GET /api/note/:noteId` - Get a specific note
- `PATCH /api/note/:noteId` - Update a specific note
- `DELETE /api/note/:noteId` - Delete a specific note (soft delete)
- `PATCH /api/note/:noteId/toggle-note` - Toggle note pin status

## 📊 Models

### User Model
- `_id`: ObjectId (Primary Key)
- `name`: String (Required, min 3 characters)
- `email`: String (Required, Unique)
- `password`: String (Required, hashed)
- `passwordResetOTP`: String (Optional, for password reset)
- `passwordResetExpires`: Date (Optional, OTP expiry)
- `createdAt`: Date (Auto-generated)
- `updatedAt`: Date (Auto-generated)

### Note Model
- `_id`: ObjectId (Primary Key)
- `user`: ObjectId (Reference to User, Required, Indexed)
- `title`: String (Required, max 200 characters)
- `description`: String (Required)
- `tags`: Array of Strings (Optional)
- `category`: String (Optional, defaults to "general")
- `isPinned`: Boolean (Optional, defaults to false)
- `isDeleted`: Boolean (Optional, defaults to false, for soft delete)
- `createdAt`: Date (Auto-generated)
- `updatedAt`: Date (Auto-generated)

## 🛡️ Middleware

### Protected Routes
- **Purpose**: Authenticates requests using JWT tokens stored in cookies
- **Functionality**: Verifies JWT token, extracts user ID, and adds it to request object
- **Usage**: Applied to all routes requiring authentication
- **Response Codes**:
  - `401` - Unauthorized (no token or invalid token)
  - `200` - Success (token valid, user authorized)

## 🧪 Testing

The application includes comprehensive test suites for both authentication and note management functionality:

- `tests/test.auth.js` - Tests for all authentication endpoints
- `tests/test.note.js` - Tests for all note management endpoints

### Running Tests
```bash
npm test
```

## 🛡️ Security Measures

1. **Password Security**
   - All passwords are hashed using bcrypt with salt rounds of 12
   - Strong password validation (minimum 8 characters, uppercase, lowercase, number, special character)

2. **JWT Authentication**
   - Tokens stored in HttpOnly cookies to prevent XSS attacks
   - 24-hour token expiration for enhanced security
   - Token verification middleware on protected routes

3. **Input Validation**
   - All request bodies are validated using express-validator
   - Sanitization of inputs to prevent injection attacks

4. **CORS Configuration**
   - Restricted to specific origins (e.g., http://localhost:3000)
   - Credentials allowed for secure cookie transmission

5. **Rate Limiting**
   - Built-in protection against brute force attacks

## 📝 Error Handling

The application implements comprehensive error handling:

- **Validation Errors**: Detailed error messages for input validation failures
- **Authentication Errors**: Clear messages for login/authorization failures
- **Database Errors**: Proper error logging and user-friendly responses
- **Server Errors**: Generic 500 responses with detailed internal logging
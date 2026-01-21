# Luminote - Full-Stack Note-Taking Application

A comprehensive full-stack MERN (MongoDB, Express, React, Node.js) application for note management with user authentication, rich text editing, and responsive design.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🌟 Overview

Luminote is a modern, full-featured note-taking application that allows users to create, organize, and manage their notes securely. The application features a responsive web interface with rich text editing capabilities, user authentication, and advanced filtering options.

Built with the MERN stack, Luminote demonstrates modern web development practices including JWT-based authentication, RESTful API design, component-based architecture, and comprehensive error handling.

## ✨ Features

### User Management
- **User Registration** - Secure sign-up with email validation
- **User Authentication** - JWT-based login/logout system
- **Password Recovery** - Forgot password workflow with OTP verification
- **Session Management** - Secure cookie-based sessions

### Note Management
- **Create Notes** - Rich text editor with formatting options
- **View Notes** - Responsive grid layout with search and filtering
- **Edit Notes** - In-place editing with real-time updates
- **Delete Notes** - Soft delete functionality for data recovery
- **Pin Notes** - Priority marking for important notes
- **Categorize Notes** - Organize notes by categories
- **Tag Notes** - Add custom tags for better organization

### Advanced Features
- **Search & Filter** - Find notes by title, content, or tags
- **Pagination** - Efficient loading of large note collections
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates** - Instant UI updates after operations
- **Loading States** - Visual feedback during operations
- **Error Handling** - User-friendly error messages and validation

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token for authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email notifications
- **Pino** - High-performance logging
- **Express-validator** - Request validation
- **Cors** - Cross-Origin Resource Sharing

### Frontend
- **React** - Component-based UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling framework
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library
- **Headless UI** - Accessible UI components
- **DOMPurify** - XSS protection for rich content

### Testing
- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing
- **Chai & Chai-HTTP** - Backend testing utilities
- **Mocha** - Test runner for backend

## 🏗️ Architecture

### Backend Architecture
```
backend/
├── config/           # Database configuration
├── controllers/      # Business logic implementation
├── middleware/       # Authentication and validation
├── models/           # Database schemas
├── routes/           # API endpoint definitions
├── tests/            # Backend test suites
├── index.js          # Main application entry point
└── README.md         # Backend documentation
```

### Frontend Architecture
```
frontend/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images and media
│   ├── components/   # Reusable UI components
│   ├── pages/        # Route-specific components
│   ├── services/     # API and utility services
│   ├── __tests__/    # Frontend test suites
│   └── App.js        # Main application component
└── README.md         # Frontend documentation
```

## 📁 Project Structure
```
luminote/
├── backend/          # Node.js + Express server
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── .env
│   ├── index.js
│   └── README.md
├── frontend/         # React client application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── __tests__/
│   ├── .env
│   └── README.md
├── README.md         # This file (overall project overview)
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or cloud instance)
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Return to project root**
```bash
cd ..
```

### Configuration

#### Backend Configuration
Create a `.env` file in the `backend/` directory:
```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb://localhost:27017/luminote

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Node Environment
NODE_ENV=development
```

#### Frontend Configuration
Create a `.env` file in the `frontend/` directory:
```env
# API Base URL
REACT_APP_API_BASE_URL=http://localhost:5000
```

## ▶️ Running the Application

### Development Mode

1. **Start the backend server**
```bash
cd backend
npm run dev
```

2. **Start the frontend server (in a new terminal)**
```bash
cd frontend
npm start
```

3. **Open your browser**
Visit `http://localhost:3000` to access the application

```

## 🌐 API Documentation

### Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires authentication)
- `POST /api/auth/forgot-password` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user data (requires authentication)

### Note Endpoints (`/api/note`)
- `POST /api/note/create` - Create a new note (requires authentication)
- `GET /api/note/` - Get all user's notes (requires authentication)
- `GET /api/note/:noteId` - Get a specific note (requires authentication)
- `PATCH /api/note/:noteId` - Update a specific note (requires authentication)
- `DELETE /api/note/:noteId` - Delete a specific note (requires authentication)
- `PATCH /api/note/:noteId/toggle-note` - Toggle note pin status (requires authentication)

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Test Coverage
- **Authentication Flow** - Complete user registration, login, and password reset
- **Note Management** - CRUD operations, filtering, and pinning
- **API Integration** - End-to-end API testing
- **Component Testing** - Individual component behavior validation
- **Error Handling** - Validation and error response testing

## 🔒 Security Features

### Backend Security
- **Password Hashing** - Bcrypt with salt rounds of 12
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Express-validator for request sanitization
- **CORS Protection** - Configured for secure cross-origin requests
- **Cookie Security** - HttpOnly and SameSite flags

### Frontend Security
- **XSS Prevention** - DOMPurify for HTML content sanitization
- **Secure API Calls** - Credential configuration for axios
- **Input Validation** - Client-side validation for user inputs

### Code Standards
- Follow ESLint configuration for JavaScript
- Maintain consistent component structure
- Write comprehensive tests for new features
- Update documentation as needed

<p align="center">
  Made with ❤️ using the MERN Stack
</p>
# Luminote Frontend

A modern React frontend application for the Luminote note-taking platform, featuring a responsive UI with authentication, rich text editing, and comprehensive note management functionality.

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Routing](#routing)
- [Components](#components)
- [Pages](#pages)
- [Services](#services)
- [Styling](#styling)
- [Testing](#testing)
- [Deployment](#deployment)

## ✨ Features

- **User Authentication System**
  - Registration with validation
  - Secure login/logout functionality
  - Forgot password workflow
  - OTP verification
  - Password reset

- **Note Management Dashboard**
  - View all notes in a responsive grid layout
  - Advanced filtering (search, category, pinned status)
  - Pagination for better performance
  - Loading states and error handling

- **Rich Note Editor**
  - Rich text editing capabilities
  - Formatting toolbar (bold, italic, underline, alignment)
  - Category selection
  - Tag management
  - Pin/unpin functionality
  - Loading indicators during save operations

- **Responsive Design**
  - Mobile-first approach
  - Works on all device sizes
  - Touch-friendly interface

- **User Experience Enhancements**
  - Toast notifications
  - Loading spinners
  - Smooth transitions
  - Intuitive navigation

## 🛠️ Technology Stack

- **React** - JavaScript library for building user interfaces
- **React Router** - Declarative routing for React applications
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library
- **Headless UI** - Unstyled, accessible UI components
- **DOMPurify** - XSS sanitizer for HTML content
- **JS Cookie** - Cookie manipulation library
- **Anime.js & AOS** - Animation libraries
- **Jest & React Testing Library** - Testing framework and utilities

## 📁 Directory Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── logo.png
│   ├── components/
│   │   ├── common/
│   │   │   ├── Alert.js
│   │   │   ├── AuthCard.js
│   │   │   ├── Button.js
│   │   │   └── Input.js
│   │   ├── layout/
│   │   │   └── Header.js
│   │   ├── Loading.js
│   │   └── Pagination.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── ForgotPassword.js
│   │   │   ├── Login.js
│   │   │   ├── ResetPassword.js
│   │   │   ├── Signup.js
│   │   │   └── VerifyOTP.js
│   │   └── notes/
│   │       ├── NoteEditor.js
│   │       └── NotesDashboard.js
│   ├── services/
│   │   └── api.js
│   ├── __tests__/
│   │   ├── auth-simple.test.js
│   │   ├── notes-simple.test.js
│   │   └── smoke.test.js
│   ├── App.js
│   ├── App.css
│   ├── index.css
│   └── index.js
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables) section).

4. **Start the development server**
```bash
npm start
```

5. **Run tests**
```bash
npm test
```

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Base URL
REACT_APP_API_BASE_URL=http://localhost:3000

```

## 🗺️ Routing

The application uses React Router for navigation with the following routes:

### Public Routes
- `/` - Login page
- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Forgot password form
- `/verify-otp` - OTP verification page
- `/reset-password` - Password reset form

### Protected Routes (require authentication)
- `/notes` - Notes dashboard
- `/notes/create` - Create new note
- `/notes/edit/:noteId` - Edit existing note

## 🧩 Components

### Common Components (`src/components/common/`)
- **Alert.js** - Toast notification system with success/error messages
- **AuthCard.js** - Wrapper component for authentication forms with consistent styling
- **Button.js** - Reusable button component with loading states
- **Input.js** - Custom input component with validation and icon support

### Layout Components (`src/components/layout/`)
- **Header.js** - Application header with navigation and logout functionality

### Utility Components
- **Loading.js** - Loading spinner component for asynchronous operations
- **Pagination.js** - Pagination controls for note lists

## 📄 Pages

### Authentication Pages (`src/pages/auth/`)
- **Login.js** - User login form with validation and password visibility toggle
- **Signup.js** - User registration form with password strength validation
- **ForgotPassword.js** - Email input for initiating password reset
- **VerifyOTP.js** - OTP verification form for password reset
- **ResetPassword.js** - New password form with confirmation

### Notes Pages (`src/pages/notes/`)
- **NotesDashboard.js** - Main dashboard displaying notes with filtering, search, and pagination
- **NoteEditor.js** - Rich text editor for creating and updating notes with formatting tools

## 🌐 Services

### API Service (`src/services/api.js`)
- **Axios Instance** - Preconfigured instance with base URL and credentials
- **Request Interceptor** - Ensures cookies are included in all requests
- **Backend Integration** - Handles all API communications with the backend

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Custom CSS** - Additional styles in `index.css` and `App.css`
- **Responsive Design** - Mobile-first approach with breakpoints for all screen sizes
- **Consistent Theme** - Unified color palette and typography throughout the application

### Key Styling Features:
- **Color Palette**: Indigo primary color with appropriate contrast ratios
- **Typography**: Consistent font sizes and weights
- **Spacing**: Systematic use of margin and padding utilities
- **Shadows and Borders**: Subtle elevation effects for depth
- **Transitions**: Smooth animations for interactive elements

## 🧪 Testing

The application includes comprehensive test suites for both authentication and note management functionality:

- `__tests__/auth-simple.test.js` - Tests for all authentication components
- `__tests__/notes-simple.test.js` - Tests for all note management components
- `__tests__/smoke.test.js` - Basic smoke tests

### Testing Features:
- **Component Rendering** - Verifies components render correctly
- **Form Validation** - Tests input validation logic
- **API Integration** - Mocks API calls and tests responses
- **User Interactions** - Simulates user actions and verifies outcomes
- **Error Handling** - Tests error scenarios and user feedback

### Running Tests
```bash
# Run all tests
npm test

# Run tests without watch mode
npm test -- --watchAll=false

# Run specific test file
npm test auth-simple.test.js

# Run with coverage
npm test -- --coverage
```

## 📱 Responsive Design

The application is designed with a mobile-first approach and includes responsive features:

- **Mobile Views** - Single column layout on small screens
- **Tablet Views** - Two column layout on medium screens
- **Desktop Views** - Three column layout on large screens
- **Touch-Friendly** - Adequate touch targets and gestures
- **Performance** - Optimized for fast loading on all devices

## 🔒 Security Features

- **XSS Protection** - DOMPurify sanitizes HTML content
- **Secure API Calls** - Axios configured with credentials
- **Input Validation** - Client-side validation for user inputs
- **Cookie Handling** - Secure cookie management for authentication

## 🛠️ Development Scripts

- `npm start` - Start development server with hot reloading
- `npm test` - Run tests in watch mode

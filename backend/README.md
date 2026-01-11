# Role-Based Authentication Backend

Backend API server for the role-based authentication system built with Node.js and Express.

## Features

- RESTful API endpoints
- JWT-based authentication
- Role-based access control
- User management
- Secure password hashing with bcrypt

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   DATABASE_URL=mongodb://localhost:27017/role-based-auth
   ```
   
   **Note:** 
   - For local MongoDB: `mongodb://localhost:27017/role-based-auth`
   - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/role-based-auth`
   - Make sure MongoDB is running before starting the server

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Authentication (to be implemented)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users (to be implemented)
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

## Project Structure

```
backend/
├── server.js          # Main server file
├── routes/            # API routes
├── controllers/       # Route controllers
├── models/            # Data models
├── middleware/        # Custom middleware (auth, validation, etc.)
├── config/            # Configuration files
├── utils/             # Utility functions
└── package.json       # Dependencies and scripts
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT token expiration time
- `DATABASE_URL` - MongoDB connection string
  - Local: `mongodb://localhost:27017/role-based-auth`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/role-based-auth`

## Database Setup

### Local MongoDB

1. Install MongoDB on your system ([Download MongoDB](https://www.mongodb.com/try/download/community))
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS (using Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```
3. Set `DATABASE_URL=mongodb://localhost:27017/role-based-auth` in `.env`

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user and set up network access
4. Get your connection string from "Connect" → "Connect your application"
5. Set `DATABASE_URL` in `.env` with your Atlas connection string

## Security Notes

- Always use environment variables for sensitive data
- Never commit `.env` file to version control
- Use strong JWT secrets in production
- Implement rate limiting for production
- Use HTTPS in production


# Frontend-Backend Integration Guide

This guide explains how the frontend and backend are integrated in the Local Hunt application.

## Architecture Overview

- **Backend**: Node.js/Express server running on port 5000
- **Frontend**: React/Vite application running on port 5173
- **Database**: MongoDB (configured in backend)
- **Authentication**: JWT tokens stored in localStorage

## Backend API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/test` - Test endpoint

### Vendors/Businesses
- `GET /api/vendors` - Get all vendors
- `POST /api/vendors` - Create new vendor (requires auth)
- `GET /api/vendors/search` - Search vendors by name, category, or location
- `PUT /api/vendors/:id` - Update vendor (requires auth)
- `DELETE /api/vendors/:id` - Delete vendor (requires auth)

### Categories
- `GET /api/categories` - Get all categories

## Frontend Integration

### API Configuration
- Base URL: `http://localhost:5000` (configurable via `VITE_API_URL`)
- Automatic JWT token inclusion in requests
- CORS configured for frontend origin

### Authentication Flow
1. User signs up → `POST /api/auth/register`
2. User signs in → `POST /api/auth/login`
3. JWT token stored in localStorage
4. Token automatically included in subsequent requests

### Business Data Flow
1. Frontend fetches businesses → `GET /api/vendors`
2. Data transformed to match frontend interface
3. Real-time updates when backend data changes

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running (local or cloud)

### Environment Setup

1. **Backend Environment** (create `backend/.env`):
```
MONGO_URI=mongodb://localhost:27017/localhunt
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:5173
PORT=5000
```

2. **Frontend Environment** (create `frontend/.env`):
```
VITE_API_URL=http://localhost:5000
```

### Running the Application

#### Option 1: Use the provided scripts
- **Windows**: Run `start-dev.bat`
- **Linux/Mac**: Run `./start-dev.sh`

#### Option 2: Manual startup
1. Start backend:
```bash
cd backend
npm install
npm run dev
```

2. Start frontend (in new terminal):
```bash
cd frontend
npm install
npm run dev
```

### Testing the Integration

1. **Backend Health Check**: Visit `http://localhost:5000`
2. **Frontend**: Visit `http://localhost:5173`
3. **API Test**: Visit `http://localhost:5000/api/auth/test`

## Key Integration Points

### 1. Authentication
- Sign up form connects to `/api/auth/register`
- Sign in form connects to `/api/auth/login`
- JWT tokens automatically included in API requests

### 2. Business Data
- Featured businesses load from `/api/vendors`
- Search functionality uses `/api/vendors/search`
- Real-time data updates

### 3. Error Handling
- Network errors displayed to users
- Loading states during API calls
- Graceful fallbacks for missing data

## Development Notes

### CORS Configuration
Backend is configured to allow requests from `http://localhost:5173`

### Token Management
- Tokens stored in localStorage
- Automatic inclusion in API requests
- No automatic refresh (tokens expire after 1 hour)

### Data Transformation
Backend vendor data is transformed to match frontend business interface:
- `shopName` → `name`
- `_id` → `id`
- Additional fields added with defaults

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for frontend URL
2. **Connection Refused**: Check if backend is running on port 5000
3. **Authentication Fails**: Verify JWT_SECRET is set in backend
4. **No Data**: Check MongoDB connection

### Debug Steps

1. Check backend logs for errors
2. Verify API endpoints with Postman/curl
3. Check browser network tab for failed requests
4. Ensure MongoDB is running and accessible

## Next Steps

- Add user profile management
- Implement business reviews and ratings
- Add real-time notifications
- Implement image upload for businesses
- Add location-based search with coordinates

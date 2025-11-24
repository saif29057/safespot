# 401 Unauthorized Error - Fix Summary

## Problem Identified

When logging in with a user with "client" role, you were receiving a **401 Unauthorized error** when trying to access protected endpoints.

### Root Causes:

1. **Token Not Stored**: The login endpoint was returning a valid JWT token, but the frontend wasn't saving it to `localStorage`
2. **Token Not Sent in Requests**: Subsequent API requests weren't including the JWT token in the `Authorization` header
3. **Inconsistent API Implementation**: Each component was manually building fetch requests with auth headers, prone to errors

## Solutions Applied

### 1. Updated Login Component (`Login.jsx`)
- Now saves the JWT token to localStorage after successful login:
```javascript
localStorage.setItem('token', data.token);
localStorage.setItem('refresh_token', data.refresh_token);
```

### 2. Created API Utility Module (`utils/api.js`)
- Centralized API request handling with automatic token injection
- Functions: `apiRequest()`, `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()`
- Automatically adds `Authorization: Bearer <token>` header to all requests
- Handles 401 responses by clearing tokens and redirecting to login

### 3. Updated Accueil Component (`pages/Accueil.jsx`)
- Now uses `apiGet('/profile/')` instead of manual fetch calls
- Cleaner, more maintainable code with consistent error handling

## How to Use the API Utility

In any component that needs to make authenticated requests:

```javascript
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api';

// GET request
const data = await apiGet('/profile/');

// POST request
const response = await apiPost('/reviews/', {
  name: 'John',
  email: 'john@example.com',
  rating: 5,
  message: 'Great!'
});

// PUT request
const updated = await apiPut('/profile/', { nom: 'NewName' });

// DELETE request
await apiDelete('/reviews/123/');
```

## Testing

1. Log in with a client user account
2. The token should be stored in localStorage
3. Navigate to protected pages (Accueil, Dashboard, etc.)
4. API requests should now include the authorization header
5. No more 401 errors!

## Additional Notes

- **Backend**: The JWT token is correctly configured in `settings.py` with a 5-hour lifetime
- **Token Refresh**: Currently using short-lived tokens. Consider implementing token refresh logic if needed
- **CORS**: Already configured to allow requests from `http://localhost:5173`
- **Role-Based Access**: The `client` role should now work properly once tokens are transmitted correctly

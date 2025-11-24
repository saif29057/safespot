/**
 * API utility for making authenticated requests with JWT
 * Handles token refresh, timeouts, and common error cases
 */

// Configuration de l'URL de base de l'API en fonction de l'environnement
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';
const IS_DEVELOPMENT = import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true';
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Custom error class for API errors
class ApiError extends Error {
  constructor(message, status, errorCode) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorCode = errorCode;
  }
}

/**
 * Make an authenticated API request with timeout and error handling
 * @param {string} endpoint - The API endpoint (without base URL)
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @param {number} retries - Number of retry attempts (for token refresh)
 * @returns {Promise<object>} Response data
 * @throws {ApiError} If the request fails
 */
export async function apiRequest(endpoint, options = {}, retries = 1) {
  // Ensure endpoint starts with a slash
  const apiEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${API_BASE_URL}${apiEndpoint}`;
  
  // Get auth tokens
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  // Set up headers
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  });

  // Add auth header if token exists
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Log request details in development
  if (IS_DEVELOPMENT) {
    console.log(`[API] ${options.method || 'GET'} ${url}`, {
      headers: Object.fromEntries(headers.entries()),
      body: options.body,
    });
  }

  // Set up request options
  const requestOptions = {
    ...options,
    headers,
    credentials: 'include', // Important pour les cookies de session
  };

  // Add timeout to the request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...requestOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Log response details in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response ${response.status} ${response.statusText}`, {
        url,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      });
    }

    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.clone().json();
      } catch (e) {
        console.error('Erreur lors du parsing de la réponse JSON:', e);
        const text = await response.text();
        console.error('Réponse brute:', text);
        throw new ApiError('Réponse serveur invalide', response.status, 'INVALID_RESPONSE');
      }
    } else {
      data = await response.text();
    }

    // Handle non-2xx responses
    if (!response.ok) {
      // Log error details in development
      if (IS_DEVELOPMENT) {
        console.error('Erreur API:', {
          url,
          status: response.status,
          data,
        });
      }

      // Handle token expiration
      if (response.status === 401 && retries > 0 && token && refreshToken) {
        console.log('Token expiré, tentative de rafraîchissement...');
        try {
          // Try to refresh the token
          const refreshResponse = await fetch(`${API_BASE_URL}token/refresh/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshResponse.ok) {
            const { access } = await refreshResponse.json();
            localStorage.setItem('token', access);
            
            // Retry the original request with the new token
            return apiRequest(endpoint, {
              ...options,
              headers: {
                ...options.headers,
                'Authorization': `Bearer ${access}`,
              },
            }, retries - 1);
          }
        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement du token:', refreshError);
          // Continue to throw the original error if refresh fails
        }
      }

      throw new ApiError(
        data.message || data.detail || 'Une erreur est survenue',
        response.status,
        data.error_code || data.code || 'API_ERROR',
        data // Include full response data for debugging
      );
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur API complète:', {
        url,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          ...(error.response && {
            response: {
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data,
            },
          }),
        },
      });
    }

    // Handle specific error cases
    if (error.name === 'AbortError') {
      throw new ApiError('La requête a expiré', 408, 'REQUEST_TIMEOUT');
    }

    // Handle network errors
    if (error instanceof TypeError) {
      console.error('Erreur réseau:', error);
      throw new ApiError('Impossible de se connecter au serveur. Vérifiez votre connexion Internet.', 0, 'NETWORK_ERROR');
    }

    // Re-throw if it's already an ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle other errors
    console.error('Erreur inattendue:', error);
    throw new ApiError(
      error.message || 'Une erreur inattendue est survenue', 
      error.status || 500, 
      error.code || 'UNKNOWN_ERROR',
      error
    );
  }
}

/**
 * Make a GET request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} params - URL parameters as key-value pairs
 * @param {object} headers - Additional headers
 * @returns {Promise<object>} Response data
 * @throws {ApiError} If the request fails
 */
export function apiGet(endpoint, params = {}, headers = {}) {
  // Convert params object to URLSearchParams
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  
  return apiRequest(url, { 
    method: 'GET',
    headers: {
      ...headers
    }
  });
}

/**
 * Make a POST request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} data - Data to send in the request body
 * @param {object} headers - Additional headers
 * @returns {Promise<object>} Response data
 * @throws {ApiError} If the request fails
 */
export function apiPost(endpoint, data = {}, headers = {}) {
  // Log request data in development
  if (IS_DEVELOPMENT) {
    console.log(`[API] POST ${endpoint}`, { data });
  }

  return apiRequest(endpoint, {
    method: 'POST',
    headers: {
      ...headers,
    },
    body: JSON.stringify(data),
  }).catch(error => {
    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API] POST ${endpoint} failed:`, error);
    }
    
    // Add more context to the error
    error.endpoint = endpoint;
    error.requestData = data;
    
    // Re-throw the error for the calling code to handle
    throw error;
  });
}

/**
 * Make a PUT request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} data - Data to send in the request body
 * @param {object} headers - Additional headers
 * @returns {Promise<object>} Response data
 * @throws {ApiError} If the request fails
 */
export function apiPut(endpoint, data = {}, headers = {}) {
  return apiRequest(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  });
}

/**
 * Make a PATCH request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} data - Data to send in the request body
 * @param {object} headers - Additional headers
 * @returns {Promise<object>} Response data
 * @throws {ApiError} If the request fails
 */
export function apiPatch(endpoint, data = {}, headers = {}) {
  return apiRequest(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  });
}

/**
 * Make a DELETE request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {object} headers - Additional headers
 * @returns {Promise<object>} Response data
 * @throws {ApiError} If the request fails
 */
export function apiDelete(endpoint, headers = {}) {
  return apiRequest(endpoint, {
    method: 'DELETE',
    headers: {
      ...headers
    }
  });
}

/**
 * Upload a file using FormData
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {File} file - File to upload
 * @param {string} fieldName - Field name for the file (default: 'file')
 * @param {object} additionalData - Additional form data to include
 * @returns {Promise<object>} Response data
 * @throws {ApiError} If the upload fails
 */
export async function apiUploadFile(endpoint, file, fieldName = 'file', additionalData = {}) {
  const formData = new FormData();
  formData.append(fieldName, file);
  
  // Append additional data to formData
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  return apiRequest(endpoint, {
    method: 'POST',
    headers: {
      // Don't set Content-Type, let the browser set it with the correct boundary
    },
    body: formData
  });
}

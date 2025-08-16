// Token management helper functions
const TOKEN_KEYS = {
  ACCESS: 'access',
  REFRESH: 'refresh'
};

/**
 * Get access token from localStorage
 * @returns {string|null} The access token or null if not found
 */
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEYS.ACCESS);
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} The refresh token or null if not found
 */
export const getRefreshToken = () => {
  return localStorage.getItem(TOKEN_KEYS.REFRESH);
};

/**
 * Set access token in localStorage
 * @param {string} token - The access token to store
 */
export const setAccessToken = (token) => {
  localStorage.setItem(TOKEN_KEYS.ACCESS, token);
};

/**
 * Set refresh token in localStorage
 * @param {string} token - The refresh token to store
 */
export const setRefreshToken = (token) => {
  localStorage.setItem(TOKEN_KEYS.REFRESH, token);
};

/**
 * Remove access token from localStorage
 */
export const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
};

/**
 * Remove refresh token from localStorage
 */
export const removeRefreshToken = () => {
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
};

/**
 * Remove all tokens from localStorage
 */
export const clearAllTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
};

/**
 * Check if access token exists
 * @returns {boolean} True if access token exists, false otherwise
 */
export const hasAccessToken = () => {
  return !!getAccessToken();
};

/**
 * Check if refresh token exists
 * @returns {boolean} True if refresh token exists, false otherwise
 */
export const hasRefreshToken = () => {
  return !!getRefreshToken();
};

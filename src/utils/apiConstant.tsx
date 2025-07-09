export const API = {
  BASE_URL: 'https://mangalbhav.com/',

  UserInfoInsert: 'UserInfoInsert',
  EntityProfileInsert: 'EntityProfileInsert',
  EntityProfileSelectAll: 'EntityProfileSelectAll',
};

export const API_ERROR_CODE = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export const POST = 'POST';
export const GET = 'GET';
export const PATCH = 'PATCH';
export const DELETE = 'DELETE';

// API request timeout settings
export const API_TIMEOUT = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 120000, // 2 minutes for uploads
  LONG_OPERATION: 60000, // 1 minute for long operations
} as const;

export const API_CACHE = {
  NO_CACHE: 'no-cache',
  SHORT: 60, // 1 minute in seconds
  MEDIUM: 300, // 5 minutes in seconds
  LONG: 3600, // 1 hour in seconds
  VERY_LONG: 86400, // 1 day in seconds
} as const;

// Rate limiting settings
export const API_RATE_LIMIT = {
  MAX_REQUESTS_PER_MINUTE: 60,
  RETRY_AFTER: 1000, // 1 second in milliseconds
  MAX_RETRIES: 3,
} as const;

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
export const ITEMS_PER_PAGE = 10;

export type HttpMethod = keyof typeof HTTP_METHOD;
export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
export type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];

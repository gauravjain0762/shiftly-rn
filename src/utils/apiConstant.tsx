export const API = {
  BASE_URL: 'https://sky.devicebee.com/Shiftly/api/',
  SOCKET_URL: 'https://sky.devicebee.com',
  //  -------   Company    --------

  // Auth
  CompanyLogin: '/company/login',
  CompanyLogout: '/company/logout',
  CompanyResendOTP: '/company/resendOTP',
  CompanySignup: '/company/register',
  companyOTPVerify: '/company/verifyOTP',
  companyForgotPassword: '/company/forgotPassword',
  companyResetPassword: '/company/resetPassword',
  companyChangePassword: '/company/changePassword',
  companyDeleteAccount: '/company/deleteAccount',
  companyGoogleSignIn: '/company/googleSignIn',
  companyAppleSignIn: '/company/appleSignin',

  // Dashboard
  getDashboard: 'company/getDashboard',
  getBusinessTypes: '/company/getBusinessTypes',
  getServices: '/company/getServices',
  getCompanyPosts: '/company/getPosts',
  getCompanyJobs: '/company/getJobs',
  getSkills: '/company/getSkills',
  getSuggestedEmployees: '/company/getSuggestedEmployees',
  getFacilities: '/company/getFacilities',
  getCompanyJobDetails: '/company/getJobDetails',
  addShortlistEmployee: '/company/shortlistEmployee',
  unshortlistEmployee: '/company/unshortlistEmployee',
  editCompanyJob: '/company/editJob',

  // UserDetails
  getCompanyProfile: '/company/getProfile',
  updateCompanyProfile: '/company/updateProfile',

  // create
  createCompanyPost: '/company/createPost',
  createCompanyJob: '/company/createJob',

  //Chats
  getCompanyChats: '/company/getChats',
  getCompanyChatMessages: '/company/getChatMessages',
  sendCompanyMessage: '/company/sendMessage',

  //Notifications
  getCompanyNotifications: '/company/getNotifications',

  // Notifications
  sendInterviewInvites: '/company/sendInterviewInvites',

  // CompanyLogin: '',

  //  -------   Employee    --------
  // Auth
  employeeLogin: '/login',
  employeeLogout: '/logout',
  employeeResendOTP: '/resendOTP',
  employeeSignup: '/register',
  employeeOTPVerify: '/verifyOTP',
  employeeSendOTP: '/sendOTP',
  employeeForgotPassword: '/forgotPassword',
  employeeResetPassword: '/resetPassword',
  employeeChangePassword: '/changePassword',
  employeeDeleteAccount: '/deleteAccount',
  employeeApplyJob: '/applyJob',
  employeeGoogleSignIn: '/googleSignin',
  employeeAppleSignIn: '/appleSignin',

  // Dashboard
  getEmployeePosts: '/getPosts',
  // getJobs: '/jobs/list',
  getEmployeeJobs: '/getJobs',
  getEmployeeJobDetails: '/getJobDetails',
  getEmployeeSkills: '/getSkills',
  addRemoveFavourite: '/addRemoveFavourite',
  getFavouritesJob: '/getFavourites',
  getFilterData: '/getFilterData',
  getActivities: '/getActivities',

  // UserDetails
  getProfile: '/getProfile',
  empUpdateProfile: '/updateProfile',
  addUpdateEducation: '/addUpdateEducation',
  addUpdateExperience: '/addUpdateExperience',
  updateAboutMe: '/updateAboutMe',
  getEducations: '/getEducations',
  getExperiences: '/getExperiences',
  removeEducation: '/removeEducation',
  removeExperience: 'removeExperience',
  removeResume: '/deleteResume',

  // Chats
  employeeGetChats: '/getChats',
  employeeGetChatMessages: '/getChatMessages',
  employeeSendMessage: '/sendMessage',

  //Notifications
  getEmployeeNotifications: '/getNotifications',

  // google Map API
  GOOGLE_MAP_API_KEY: 'AIzaSyC0YuOdzYKbtMXSUqnL2P6SBRC9RE_gZO4',
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

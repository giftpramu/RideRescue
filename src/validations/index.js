export * from './authSchemas';
export * from './userSchemas';
export * from './vehicleSchemas';
export * from './serviceSchemas';

// Utility function for common validations
export const createOptionalField = (schema) => {
  return schema.optional().nullable().transform((value) => 
    value === '' ? undefined : value
  );
};

// Custom validation messages
export const validationMessages = {
  required: (field) => `${field} is required`,
  email: 'Please enter a valid email address',
  minLength: (field, min) => `${field} must be at least ${min} characters`,
  maxLength: (field, max) => `${field} must not exceed ${max} characters`,
  phoneNumber: 'Please enter a valid phone number',
  passwordMatch: 'Passwords do not match',
  strongPassword: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
};
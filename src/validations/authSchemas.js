import * as yup from 'yup';

export const loginSchema = yup.object({
  usernameOrEmail: yup
    .string()
    .required('Username or Email is required')
    .trim(),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// Vehicle Owner Signup Schema
export const vehicleOwnerSignupSchema = yup.object({
  name: yup  // Add name field validation
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .trim(),
  username: yup  // Keep username validation
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim(),
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required')
    .trim(),
  contactNumber: yup
    .string()
    .required('Contact number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Please enter a valid contact number')
    .min(10, 'Invalid contact number'),
  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters')
    .trim(),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  // Vehicle Information
  brand: yup
    .string()
    .required('Vehicle brand is required')
    .trim(),
  model: yup
    .string()
    .required('Vehicle model is required')
    .trim(),
  year: yup
    .string()
    .required('Year is required')
    .matches(/^\d{4}$/, 'Year must be 4 digits')
    .test('year-range', 'Year must be between 1900 and current year + 1', function(value) {
      if (!value) return false;
      const year = parseInt(value);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear + 1;
    }),
  registrationNumber: yup
    .string()
    .required('Registration number is required')
    .min(3, 'Registration number must be at least 3 characters')
    .trim()
    .uppercase(),
});

// Service Provider Signup Schema
export const serviceProviderSignupSchema = yup.object({
  businessName: yup
    .string()
    .required('Business name is required')
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must not exceed 100 characters')
    .trim(),
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required')
    .trim(),
  mobile: yup
    .string()
    .required('Mobile number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Please enter a valid mobile number')
    .min(10, 'Invalid mobile number'),
  address: yup
    .string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters')
    .trim(),
  businessRegistrationNo: yup
    .string()
    .required('Business registration number is required')
    .min(3, 'Business registration number must be at least 3 characters')
    .trim(),
  experienceYears: yup
    .string()
    .required('Experience years is required')
    .matches(/^\d+$/, 'Experience years must be a number')
    .test('experience-range', 'Experience years must be between 0 and 50', function(value) {
      if (!value) return false;
      const years = parseInt(value);
      return years >= 0 && years <= 50;
    }),
  serviceArea: yup
    .string()
    .required('Service area is required')
    .min(3, 'Service area must be at least 3 characters')
    .max(100, 'Service area must not exceed 100 characters')
    .trim(),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .trim(),
});

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  token: yup
    .string()
    .required('Reset token is required'),
});
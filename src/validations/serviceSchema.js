import * as yup from 'yup';

export const serviceRequestSchema = yup.object({
  serviceType: yup
    .string()
    .required('Service type is required'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  urgency: yup
    .string()
    .required('Urgency level is required')
    .oneOf(['low', 'medium', 'high'], 'Invalid urgency level'),
  preferredDate: yup
    .date()
    .required('Preferred date is required')
    .min(new Date(), 'Date cannot be in the past'),
  location: yup
    .string()
    .required('Service location is required')
    .trim(),
});

export const serviceProviderRegistrationSchema = yup.object({
  businessName: yup
    .string()
    .required('Business name is required')
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must not exceed 100 characters')
    .trim(),
  businessAddress: yup
    .string()
    .required('Business address is required')
    .max(200, 'Address must not exceed 200 characters')
    .trim(),
  businessPhone: yup
    .string()
    .required('Business phone number is required')
    .matches(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  licenseNumber: yup
    .string()
    .required('License number is required')
    .trim(),
  servicesOffered: yup
    .array()
    .of(yup.string())
    .min(1, 'Please select at least one service')
    .required('Services offered is required'),
  yearsOfExperience: yup
    .number()
    .required('Years of experience is required')
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience seems too high'),
});
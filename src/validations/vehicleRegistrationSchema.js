import * as yup from 'yup';

export const vehicleRegistrationSchema = yup.object({
  make: yup
    .string()
    .required('Vehicle make is required')
    .trim(),
  model: yup
    .string()
    .required('Vehicle model is required')
    .trim(),
  year: yup
    .number()
    .required('Year is required')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  licensePlate: yup
    .string()
    .required('License plate is required')
    .trim()
    .uppercase(),
  vin: yup
    .string()
    .required('VIN is required')
    .length(17, 'VIN must be exactly 17 characters')
    .matches(/^[A-HJ-NPR-Z0-9]+$/, 'Invalid VIN format')
    .trim()
    .uppercase(),
  color: yup
    .string()
    .required('Vehicle color is required')
    .trim(),
  mileage: yup
    .number()
    .required('Mileage is required')
    .min(0, 'Mileage cannot be negative'),
});
import { cloudinaryService } from './cloudinaryService';

export const documentService = {
  
  // Use Cloudinary for uploads
  uploadDocument: async (serviceProviderId, documentType, file) => {
    return await cloudinaryService.uploadDocument(file, serviceProviderId, documentType);
  },

  completeRegistration: async (serviceProviderId) => {
    return await cloudinaryService.completeRegistration(serviceProviderId);
  }
};
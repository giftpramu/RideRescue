import api from './index';

const CLOUDINARY_CLOUD_NAME = 'flexflow001';
const CLOUDINARY_UPLOAD_PRESET = 'riderescue_docs';

export const cloudinaryService = {
  
  // Upload file directly to Cloudinary
  uploadDocument: async (file, serviceProviderId, documentType) => {
    try {
      console.log('Starting Cloudinary upload...');
      console.log('File details:', {
        name: file.name,
        size: file.size,
        uri: file.uri,
        type: file.mimeType
      });

      // Create FormData for Cloudinary upload
      const formData = new FormData();
      
      // React Native FormData requires specific format
      formData.append('file', {
        uri: file.uri,
        type: file.mimeType || 'application/pdf',
        name: file.name
      });
      
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', `riderescue/documents/${serviceProviderId}`);
      formData.append('resource_type', 'auto');

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
      console.log('Uploading to:', uploadUrl);

      // Upload directly to Cloudinary with proper headers for React Native
      const cloudinaryResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Cloudinary response status:', cloudinaryResponse.status);

      if (!cloudinaryResponse.ok) {
        const errorText = await cloudinaryResponse.text();
        console.error('Cloudinary upload failed:', errorText);
        throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.status} - ${errorText}`);
      }

      const cloudinaryData = await cloudinaryResponse.json();
      console.log('Cloudinary upload successful:', cloudinaryData.secure_url);

      // Save the Cloudinary URL to your backend
      const backendResponse = await api.post(`/api/documents/upload/${serviceProviderId}`, {
        documentType,
        cloudinaryUrl: cloudinaryData.secure_url,
        fileName: file.name
      });

      console.log('Backend save successful');

      return {
        document: backendResponse.data.document,
        cloudinaryUrl: cloudinaryData.secure_url
      };

    } catch (error) {
      console.error('Document upload error details:', error);
      
      if (error.message.includes('Network request failed')) {
        throw new Error('Cannot connect to cloud storage. Please check your internet connection and try again.');
      } else if (error.message.includes('Cloudinary')) {
        throw new Error('Cloud storage upload failed. Please try again.');
      } else {
        throw new Error(error.message || 'Failed to upload document');
      }
    }
  },

  completeRegistration: async (serviceProviderId) => {
    try {
      const response = await api.post(
        `/api/documents/service-provider/${serviceProviderId}/complete-registration`
      );
      return response.data;
    } catch (error) {
      console.error('Complete registration error:', error);
      throw new Error(error.response?.data?.error || 'Failed to complete registration');
    }
  }
};
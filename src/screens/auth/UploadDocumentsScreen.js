import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import { colors, typography, spacing } from '../../styles';
import { documentService } from '../../services/api/documentService';
import { useAuth } from '../../context/AuthContext';

const UploadDocumentsScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState({
    GOVERNMENT_ID: null,
    BUSINESS_LICENSE: null,
    TRAINING_CERTIFICATE: null,
  });

  const { clearRegistrationState } = useAuth();

  // Get service provider ID from route params (passed from signup)
  const serviceProviderId = route.params?.serviceProviderId;

  const handleDocumentPick = async (documentType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const file = result.assets[0];
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          Alert.alert('Error', 'File size must be less than 5MB');
          return;
        }

        setIsLoading(true);
        
        try {
          // Upload document to backend
          const response = await documentService.uploadDocument(
            serviceProviderId, 
            documentType, 
            file
          );
          
          // Update local state
          setDocuments(prev => ({
            ...prev,
            [documentType]: {
              name: file.name,
              size: file.size,
              uploaded: true,
              documentId: response.document?.id
            }
          }));

          Alert.alert('Success', 'Document uploaded successfully!');
          
        } catch (error) {
          console.error('Document upload error:', error);
          Alert.alert('Upload Failed', error.message || 'Failed to upload document');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleCompleteRegistration = async () => {
    const allDocumentsUploaded = Object.values(documents).every(doc => doc !== null && doc.uploaded);
    
    if (!allDocumentsUploaded) {
      Alert.alert('Incomplete', 'Please upload all required documents before completing registration');
      return;
    }

    setIsLoading(true);
    
    try {
      await documentService.completeRegistration(serviceProviderId);

      clearRegistrationState();
      
      Alert.alert(
        'Registration Completed!', 
        'Your registration has been submitted successfully. An admin will review your documents and activate your account within 24-48 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Registration completed successfully');
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Complete registration error:', error);
      Alert.alert('Error', error.message || 'Failed to complete registration');
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentDisplayName = (docType) => {
    switch (docType) {
      case 'GOVERNMENT_ID':
        return 'Government ID';
      case 'BUSINESS_LICENSE':
        return 'Business License';
      case 'TRAINING_CERTIFICATE':
        return 'Training Certificate';
      default:
        return docType;
    }
  };

  const DocumentUploadItem = ({ documentType }) => {
    const document = documents[documentType];
    const isUploaded = document && document.uploaded;
    
    return (
      <View style={styles.documentItem}>
        <Text style={styles.documentTitle}>
          {getDocumentDisplayName(documentType)}
        </Text>
        <TouchableOpacity
          style={[styles.uploadButton, isUploaded && styles.uploadButtonSuccess]}
          onPress={() => handleDocumentPick(documentType)}
          disabled={isLoading}
        >
          <Text style={[styles.uploadButtonText, isUploaded && styles.uploadButtonTextSuccess]}>
            {isUploaded ? 'Uploaded ✓ (Tap to replace)' : 'Choose from device'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!serviceProviderId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Service Provider ID not found. Please register again.
        </Text>
        <Button
          title="Back to Registration"
          onPress={() => navigation.navigate('ServiceProviderSignup')}
        />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <ProgressBar currentStep={2} totalSteps={2} />
        </View>

        <Text style={styles.title}>Upload Required Documents</Text>
        
        <Text style={styles.subtitle}>
          Please upload the following documents to complete your registration
        </Text>

        <View style={styles.documentsContainer}>
          <DocumentUploadItem documentType="GOVERNMENT_ID" />
          <DocumentUploadItem documentType="BUSINESS_LICENSE" />
          <DocumentUploadItem documentType="TRAINING_CERTIFICATE" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Accepted Formats:</Text>
          <Text style={styles.infoText}>
            • PDF, JPEG, JPG, PNG{'\n'}
            • Maximum file size: 5MB per document{'\n'}
            • Ensure documents are clear and readable
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? "Processing..." : "Complete Registration"}
            onPress={handleCompleteRegistration}
            loading={isLoading}
            disabled={isLoading}
            style={styles.completeButton}
            textStyle={{ color: 'black' }}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  stepText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  title: {
    ...typography.heading1,
    color: colors.white,
    marginBottom: spacing.md,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  documentsContainer: {
    flex: 1,
  },
  documentItem: {
    marginBottom: spacing.xl,
  },
  documentTitle: {
    ...typography.heading3,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  documentInfo: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  uploadButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  uploadButtonSuccess: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: colors.success,
  },
  uploadButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  uploadButtonTextSuccess: {
    color: colors.success,
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  infoTitle: {
    ...typography.heading4,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingBottom: spacing.xl,
  },
  completeButton: {
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});

export default UploadDocumentsScreen;
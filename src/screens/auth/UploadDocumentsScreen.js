import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import { colors, typography, spacing } from '../../styles';

const UploadDocumentsScreen = ({ navigation, route }) => {
  const [documents, setDocuments] = useState({
    governmentId: null,
    businessLicense: null,
    trainingCertificate: null,
  });

  const handleDocumentPick = async (documentType) => {
    // Mock document picker
    Alert.alert(
      'Document Picker',
      'In a real app, this would open the document picker',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Select Document', 
          onPress: () => {
            setDocuments(prev => ({
              ...prev,
              [documentType]: '${documentType}_document.pdf'
            }));
          }
        }
      ]
    );
  };

  const handleNext = () => {
    const allDocumentsUploaded = Object.values(documents).every(doc => doc !== null);
    
    if (!allDocumentsUploaded) {
      Alert.alert('Error', 'Please upload all required documents');
      return;
    }

    navigation.navigate('ServicePriceDetails');
  };

  const DocumentUploadItem = ({ title, documentType, isUploaded }) => (
    <View style={styles.documentItem}>
      <Text style={styles.documentTitle}>{title}</Text>
      <TouchableOpacity
        style={[styles.uploadButton, isUploaded && styles.uploadButtonSuccess]}
        onPress={() => handleDocumentPick(documentType)}
      >
        <Text style={[styles.uploadButtonText, isUploaded && styles.uploadButtonTextSuccess]}>
          {isUploaded ? 'Uploaded ✓' : 'Choose from device'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.header}>
          <ProgressBar currentStep={2} totalSteps={4} />
          <Text style={styles.stepText}>(2/4)</Text>
        </View>

        <Text style={styles.title}>Upload Below Documents</Text>

        <View style={styles.documentsContainer}>
          <DocumentUploadItem
            title="Government ID"
            documentType="governmentId"
            isUploaded={!!documents.governmentId}
          />

          <DocumentUploadItem
            title="Business License"
            documentType="businessLicense"
            isUploaded={!!documents.businessLicense}
          />

          <DocumentUploadItem
            title="Training Certificate"
            documentType="trainingCertificate"
            isUploaded={!!documents.trainingCertificate}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={handleNext}
          />
        </View>
      </View>
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
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
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
    marginBottom: spacing.md,
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
  buttonContainer: {
    paddingBottom: spacing.xl,
  },
});

export default UploadDocumentsScreen;
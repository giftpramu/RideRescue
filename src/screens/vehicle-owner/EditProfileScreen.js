import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing } from '../../styles';

const EditProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Pramudi Gamage',
    phone: user?.phone || '077 256 2589',
    email: user?.email || 'gamage123@gmail.com',
    address: user?.address || '27, Galle Road , Dehiwala',
    gender: user?.gender || 'Female',
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!profileData.name || !profileData.phone || !profileData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Here you would typically update the user profile in your backend/context
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleGenderPress = () => {
    Alert.alert(
      'Select Gender',
      '',
      [
        { text: 'Male', onPress: () => handleInputChange('gender', 'Male') },
        { text: 'Female', onPress: () => handleInputChange('gender', 'Female') },
        { text: 'Other', onPress: () => handleInputChange('gender', 'Other') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
                value={profileData.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📞</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={colors.textSecondary}
                value={profileData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={colors.textSecondary}
                value={profileData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📍</Text>
              <TextInput
                style={styles.addressInput}
                placeholder="Address"
                placeholderTextColor={colors.textSecondary}
                value={profileData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                multiline
              />
            </View>
          </View>

          <TouchableOpacity style={styles.inputGroup} onPress={handleGenderPress}>
            <View style={styles.genderContainer}>
              <Text style={styles.inputIcon}>⚥</Text>
              <Text style={styles.genderText}>{profileData.gender}</Text>
              <Text style={styles.genderArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    backgroundColor: colors.surface || '#2a2a2a',
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIcon: {
    fontSize: 16,
    marginRight: spacing.md,
    width: 20,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
  },
  addressInput: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  genderContainer: {
    backgroundColor: colors.surface || '#2a2a2a',
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  genderText: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
  },
  genderArrow: {
    color: colors.white,
    fontSize: 18,
  },
  footer: {
    marginTop: spacing.lg,
  },
  saveButton: {
    backgroundColor: colors.primary || '#3498db',
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
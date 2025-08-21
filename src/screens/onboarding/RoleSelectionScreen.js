import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Button from '../../components/common/Button';
import { colors, typography, spacing } from '../../styles';

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = React.useState(null);

  const handleContinue = () => {
    if (selectedRole) {
      navigation.navigate('Login', { userType: selectedRole });
    }
  };

  const RoleOption = ({ role, title, icon }) => (
    <TouchableOpacity
      style={[
        styles.roleOption,
        selectedRole === role && styles.selectedRole
      ]}
      onPress={() => setSelectedRole(role)}
    >
      <View style={styles.roleContent}>
        <View style={styles.checkbox}>
          {selectedRole === role && <View style={styles.checkboxSelected} />}
        </View>
        <Text style={styles.roleTitle}>{title}</Text>
        <View style={styles.iconContainer}>
          <Text style={styles.roleIcon}>{icon}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/images/car-background.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Choose your Role</Text>
        
        <View style={styles.rolesContainer}>
          <RoleOption
            role="vehicle_owner"
            title="Vehicle Owner"
            icon="👨‍💼"
          />
          
          <RoleOption
            role="service_provider"
            title="Service Provider"
            icon="🔧"
          />
        </View>
        
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
        />
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    ...typography.heading1,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    color: colors.white,
  },
  rolesContainer: {
    marginBottom: spacing.xxxl,
    gap: spacing.md,
  },
  roleOption: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedRole: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  roleTitle: {
    ...typography.heading3,
    flex: 1,
    color: colors.white,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 24,
  },
});

export default RoleSelectionScreen;
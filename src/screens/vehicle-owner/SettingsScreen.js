// src/screens/vehicle-owner/SettingsScreen.js
const SettingsScreen = ({ navigation }) => (
  <View style={styles.container}>
    <TouchableOpacity 
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
    <Text style={styles.title}>Settings</Text>
    <Text style={styles.description}>App settings will be implemented here.</Text>
  </View>
);
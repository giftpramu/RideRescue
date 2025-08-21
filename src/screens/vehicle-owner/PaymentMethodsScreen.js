const PaymentMethodsScreen = ({ navigation }) => (
  <View style={styles.container}>
    <TouchableOpacity 
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Text style={styles.backButtonText}>← Back</Text>
    </TouchableOpacity>
    <Text style={styles.title}>Payment Methods</Text>
    <Text style={styles.description}>Payment methods management will be implemented here.</Text>
  </View>
);
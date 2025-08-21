import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { colors, spacing } from '../../styles';
import { vehicleService } from '../../services/api/VehicleService';

const ServiceInsertionScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  };

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getAllVehicleServices();
      setServices(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = () => {
    navigation.navigate('CreateService', { onGoBack: loadServices });
  };

  const handleEditService = (service) => {
    navigation.navigate('CreateService', { editingService: service });
  };

  const handleDeleteService = (service) => {
    Alert.alert(
      'Delete Service',
      `Are you sure you want to delete "${service.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteService(service.id) },
      ]
    );
  };

  const deleteService = async (serviceId) => {
    try {
      setLoading(true);
      await vehicleService.deleteVehicleService(serviceId);
      setServices(services.filter(s => s.id !== serviceId));
      Alert.alert('Success', 'Service deleted successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'active' ? colors.success : colors.warning },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.serviceCategory}>Category: {item.category?.name}</Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEditService(item)}>
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDeleteService(item)}>
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredServices = services.filter((service) =>
    service.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading && services.length === 0) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Service Management</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateService}>
        <Text style={styles.createButtonText}>+ Add New Service</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderServiceItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No services found</Text>}
          contentContainerStyle={{ padding: spacing.lg }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, paddingTop: spacing.xxxl, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { marginRight: spacing.md },
  backButtonText: { color: colors.primary, fontSize: 16 },
  title: { color: colors.white, fontSize: 20, fontWeight: 'bold' },
  searchContainer: { padding: spacing.lg },
  searchInput: { backgroundColor: colors.surface, color: colors.white, padding: spacing.md, borderRadius: 8 },
  createButton: { backgroundColor: colors.primary, marginHorizontal: spacing.lg, marginBottom: spacing.lg, padding: spacing.md, borderRadius: 8, alignItems: 'center' },
  createButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  servicesList: { flex: 1, padding: spacing.lg },
  serviceCard: { backgroundColor: colors.surface, padding: spacing.lg, borderRadius: 12, marginBottom: spacing.md },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  serviceName: { color: colors.white, fontSize: 18, fontWeight: '600', flex: 1 },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: 12 },
  statusText: { color: colors.white, fontSize: 12, fontWeight: '500' },
  serviceCategory: { color: colors.textSecondary, fontSize: 14, marginBottom: spacing.md },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { flex: 1, padding: spacing.sm, borderRadius: 6, alignItems: 'center', marginHorizontal: spacing.xs },
  editButton: { backgroundColor: colors.primary },
  deleteButton: { backgroundColor: colors.error },
  actionButtonText: { color: colors.white, fontSize: 14, fontWeight: '500' },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 20 },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: spacing.md,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { ServiceInsertionScreen };

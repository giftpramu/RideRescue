import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import { colors, spacing } from '../../styles';
import { categoryService } from '../../services/api/CategoryService';

const ServiceCategoryManagementScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      // Transform backend data to match your UI expectations
      const transformedData = data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description || 'No description provided',
        serviceCount: 0, // You can implement this in backend later
        status: 'active', // You can add this field to backend later
        color: '#4CAF50', // Default color, can be added to backend later
        createdAt: category.createdAt ? new Date(category.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      }));
      setCategories(transformedData);
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  };

  const handleCreateCategory = () => {
    navigation.navigate('AddCategory');
  };

  const handleEditCategory = (category) => {
    navigation.navigate('AddCategory', { editingCategory: category });
  };

  const handleDeleteCategory = (category) => {
    if (category.serviceCount > 0) {
      Alert.alert(
        'Cannot Delete',
        'This category has ${category.serviceCount} services. Please move or delete the services first.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete "${category.name}"?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(category.id) },
      ]
    );
  };

  const deleteCategory = async (categoryId) => {
    try {
      setLoading(true);
      await categoryService.deleteCategory(categoryId);
      setCategories(categories.filter(c => c.id !== categoryId));
      Alert.alert('Success', 'Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.alert('Error', 'Failed to delete category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoryStatus = async (category) => {
    const newStatus = category.status === 'active' ? 'inactive' : 'active';
    // For now, just update locally since status isn't in backend yet
    setCategories(categories.map(c => 
      c.id === category.id ? { ...c, status: newStatus } : c
    ));
  };

  const renderCategoryItem = ({ item }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryTitleRow}>
          <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
          <Text style={styles.categoryName}>{item.name}</Text>
          <View style={[styles.statusBadge, { 
            backgroundColor: item.status === 'active' ? colors.success : colors.warning 
          }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.categoryDescription}>{item.description}</Text>
      <Text style={styles.serviceCount}>{item.serviceCount} services in this category</Text>
      <Text style={styles.createdDate}>Created: {item.createdAt}</Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditCategory(item)}
          disabled={loading}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, item.status === 'active' ? styles.deactivateButton : styles.activateButton]}
          onPress={() => toggleCategoryStatus(item)}
          disabled={loading}
        >
          <Text style={styles.actionButtonText}>
            {item.status === 'active' ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton, { 
            opacity: item.serviceCount > 0 || loading ? 0.5 : 1 
          }]}
          onPress={() => handleDeleteCategory(item)}
          disabled={item.serviceCount > 0 || loading}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading && categories.length === 0) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Service Categories</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{categories.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{categories.filter(c => c.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{categories.reduce((sum, c) => sum + c.serviceCount, 0)}</Text>
          <Text style={styles.statLabel}>Services</Text>
        </View>
      </View>

      {/* Create Category Button */}
      <TouchableOpacity 
        style={[styles.createButton, { opacity: loading ? 0.7 : 1 }]}
        onPress={handleCreateCategory}
        disabled={loading}
      >
        <Text style={styles.createButtonText}>+ Add New Category</Text>
      </TouchableOpacity>

      {/* Categories List */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryItem}
        style={styles.categoriesList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories found</Text>
            <Text style={styles.emptySubtext}>
              {searchText ? 'Try adjusting your search' : 'Create your first category to get started'}
            </Text>
          </View>
        )}
      />

      {/* Loading Overlay */}
      {loading && categories.length > 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.md,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: spacing.lg,
  },
  searchInput: {
    backgroundColor: colors.surface,
    color: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  createButton: {
    backgroundColor: colors.primary,
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesList: {
    flex: 1,
    padding: spacing.lg,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  categoryHeader: {
    marginBottom: spacing.sm,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  categoryName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  categoryDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  serviceCount: {
    color: colors.primary,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  createdDate: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  activateButton: {
    backgroundColor: colors.success,
  },
  deactivateButton: {
    backgroundColor: colors.warning,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
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

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalCloseText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  modalTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSaveText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  modalLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  modalInput: {
    backgroundColor: colors.surface,
    color: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    fontSize: 16,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: colors.white,
  },
  colorCheckmark: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: spacing.lg,
  },
  previewCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  previewName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  previewDescription: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  modalLoadingOverlay: {
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

export { ServiceCategoryManagementScreen };
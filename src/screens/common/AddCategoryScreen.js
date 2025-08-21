// src/screens/AddCategoryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { colors, spacing } from '../../styles';
import { categoryService } from '../../services/api/CategoryService';

const AddCategoryScreen = ({ navigation, route }) => {
  const editingCategory = route.params?.editingCategory || null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4CAF50');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const predefinedColors = [
    '#4CAF50', '#2196F3', '#FF9800', '#F44336',
    '#9C27B0', '#00BCD4', '#FFEB3B', '#795548',
    '#607D8B', '#E91E63', '#3F51B5', '#009688'
  ];

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setDescription(editingCategory.description);
      setSelectedColor(editingCategory.color);
    }
  }, [editingCategory]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Category name is required';
    if (!description.trim()) newErrors.description = 'Category description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      if (editingCategory) {
        const updatedCategory = await categoryService.updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
        });
        Alert.alert('Success', 'Category updated successfully');
      } else {
        await categoryService.createCategory({
          name: name.trim(),
          description: description.trim(),
        });
        Alert.alert('Success', 'Category created successfully');
      }

      navigation.goBack(); // go back to categories list
    } catch (error) {
      console.error('Error saving category:', error);
      Alert.alert('Error', 'Failed to save category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
          <Text style={[styles.backText, { opacity: loading ? 0.5 : 1 }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{editingCategory ? 'Edit Category' : 'Add Category'}</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveText, { opacity: loading ? 0.5 : 1 }]}>{loading ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Category Name *</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={text => { setName(text); if (errors.name) setErrors(prev => ({ ...prev, name: null })); }}
          placeholder="Enter category name"
          placeholderTextColor={colors.textSecondary}
          editable={!loading}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          value={description}
          onChangeText={text => { setDescription(text); if (errors.description) setErrors(prev => ({ ...prev, description: null })); }}
          placeholder="Enter category description"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          editable={!loading}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backText: { color: colors.textSecondary, fontSize: 16 },
  title: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  saveText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  content: { flex: 1, padding: spacing.lg },
  label: { color: colors.white, fontSize: 16, fontWeight: '600', marginTop: spacing.lg },
  input: { backgroundColor: colors.surface, color: colors.white, padding: spacing.md, borderRadius: 8, fontSize: 16, marginTop: spacing.sm },
  textArea: { height: 80, textAlignVertical: 'top' },
  inputError: { borderWidth: 1, borderColor: colors.error },
  errorText: { color: colors.error, fontSize: 12, marginTop: spacing.xs },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
});

export default AddCategoryScreen;

// components/common/CustomDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing } from '../../styles';

const CustomDropdown = ({
  data = [],
  value = null,
  onSelect,
  placeholder = 'Select an option',
  displayKey = 'name', // Key to display in the dropdown (e.g., 'brandName', 'modelName')
  valueKey = 'id', // Key to use as value (usually 'id')
  searchable = true,
  loading = false,
  disabled = false,
  style = {},
  dropdownStyle = {},
  itemStyle = {},
  textStyle = {},
  placeholderTextColor = colors.textSecondary,
  maxHeight = 200,
  emptyText = 'No options available',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Filter data based on search text
  const filteredData = searchable && searchText
    ? data.filter(item =>
        item[displayKey]?.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  // Get selected item display text
  const getSelectedText = () => {
    if (!value) return placeholder;
    const selectedItem = data.find(item => item[valueKey] === value);
    return selectedItem ? selectedItem[displayKey] : placeholder;
  };

  const handleSelect = (item) => {
    onSelect(item[valueKey], item);
    setIsVisible(false);
    setSearchText('');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.dropdownItem, itemStyle]}
      onPress={() => handleSelect(item)}
    >
      <Text style={[styles.dropdownItemText, textStyle]}>
        {item[displayKey]}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyText}</Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.dropdown,
          disabled && styles.dropdownDisabled,
          dropdownStyle
        ]}
        onPress={() => !disabled && setIsVisible(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.dropdownText,
            !value && { color: placeholderTextColor },
            textStyle
          ]}
          numberOfLines={1}
        >
          {getSelectedText()}
        </Text>
         <Icon 
          name={isVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={20} 
          color={disabled ? colors.textSecondary : colors.textSecondary} 
          style={{ opacity: disabled ? 0.5 : 1 }}
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            {searchable && (
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor={placeholderTextColor}
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>
            )}

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredData}
                keyExtractor={(item) => item[valueKey]?.toString() || Math.random().toString()}
                renderItem={renderItem}
                ListEmptyComponent={renderEmptyComponent}
                style={{ maxHeight: maxHeight }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  dropdownDisabled: {
    opacity: 0.5,
  },
  dropdownText: {
    flex: 1,
    color: colors.white,
    fontSize: 16,
  },
  dropdownArrow: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: spacing.sm,
  },
  dropdownArrowDisabled: {
    color: colors.textSecondary,
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 12,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    maxWidth: '90%',
    minWidth: '80%',
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.background,
    color: colors.white,
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    color: colors.white,
    fontSize: 16,
  },
  emptyContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.sm,
  },
});

export default CustomDropdown;
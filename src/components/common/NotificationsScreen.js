import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors, spacing } from '../../styles';

const NotificationsScreen = ({ navigation }) => {
  const notifications = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment Received.',
      message: 'The payment has been received from Pramudi for...',
      time: '1 min ago',
      icon: '💳',
      iconBg: colors.primary,
    },
    {
      id: 2,
      type: 'success',
      title: 'Service Bill Accepted!',
      message: 'Pramudi Gamage accepted your bill for the flat tyre...',
      time: '5 mins ago',
      icon: '✓',
      iconBg: colors.success,
    },
    {
      id: 3,
      type: 'error',
      title: 'Service Bill Rejected!',
      message: 'Your bill for full service has been rejected by Kumara',
      time: '1 day ago',
      icon: '✕',
      iconBg: colors.error,
    },
  ];

  const NotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <NotificationItem item={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
  },
  backIcon: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  notificationTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  notificationTime: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default NotificationsScreen;
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, spacing } from '../../styles';

const ServiceBillPreviewScreen = ({ navigation, route }) => {
  const { billData } = route.params || {
    billData: {
      refNumber: '000085752257',
      carOwner: 'Pramudi Gamage',
      service: 'Flat Tyre Repair',
      address: '27/12, 1st Lane, Galle Road, Mount Lavinia',
      dateTime: '21-01-2025, 9:00 am',
      senderName: 'Sterling AfterCare',
      amount: 'LKR 2,500.00'
    }
  };

  const handleSendBill = () => {
    // Navigate to success screen
    navigation.navigate('ServiceBillSuccess', { billData });
  };

  const BillDetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
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
        <Text style={styles.headerTitle}>Preview</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bill Card */}
        <View style={styles.billCard}>
          {/* Amount Header */}
          <View style={styles.amountHeader}>
            <Text style={styles.amountLabel}>Service Payment</Text>
            <Text style={styles.amountValue}>{billData.amount}</Text>
          </View>

          {/* Bill Details */}
          <View style={styles.billDetails}>
            <BillDetailRow label="Ref Number" value={billData.refNumber} />
            <BillDetailRow label="Car Owner" value={billData.carOwner} />
            <BillDetailRow label="Service" value={billData.service} />
            <BillDetailRow 
              label="Address" 
              value={billData.address}
            />
            <BillDetailRow label="Date & Time" value={billData.dateTime} />
            <BillDetailRow label="Sender Name" value={billData.senderName} />
            <BillDetailRow label="Amount" value={billData.amount} />
          </View>
        </View>
      </ScrollView>

      {/* Send Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.sendButton} onPress={handleSendBill}>
          <Text style={styles.sendButtonText}>Send to Vehicle Owner</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  billCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  amountHeader: {
    backgroundColor: colors.white,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  amountLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  amountValue: {
    color: colors.background,
    fontSize: 24,
    fontWeight: 'bold',
  },
  billDetails: {
    padding: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    color: '#666',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  detailValue: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  buttonContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  sendButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceBillPreviewScreen;
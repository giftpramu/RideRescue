import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, spacing } from '../../styles';
import { serviceRequestService } from '../../services/api/ServiceRequestService';

const ServiceRequestPreviewScreen = ({ route, navigation }) => {
  const { serviceRequest, providerId } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [additionalCharges, setAdditionalCharges] = useState([]);
  const [showAddChargeModal, setShowAddChargeModal] = useState(false);
  const [newChargeAmount, setNewChargeAmount] = useState('');
  const [newChargeReason, setNewChargeReason] = useState('');
  const [updatedTotalPrice, setUpdatedTotalPrice] = useState(serviceRequest.totalEstimatedPrice);

  useEffect(() => {
    calculateTotal();
  }, [additionalCharges]);

  const calculateTotal = () => {
    const additionalTotal = additionalCharges.reduce((sum, charge) => sum + parseFloat(charge.amount), 0);
    setUpdatedTotalPrice(serviceRequest.totalEstimatedPrice + additionalTotal);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const addAdditionalCharge = () => {
    if (!newChargeAmount || !newChargeReason) {
      Alert.alert('Error', 'Please enter both amount and reason');
      return;
    }

    const amount = parseFloat(newChargeAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const newCharge = {
      id: Date.now().toString(),
      amount: amount,
      reason: newChargeReason.trim()
    };

    setAdditionalCharges([...additionalCharges, newCharge]);
    setNewChargeAmount('');
    setNewChargeReason('');
    setShowAddChargeModal(false);
  };

  const removeAdditionalCharge = (chargeId) => {
    setAdditionalCharges(additionalCharges.filter(charge => charge.id !== chargeId));
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      // Create provider notes with additional charges info
      const providerNotes = additionalCharges.length > 0 ? 
        `Additional charges: ${additionalCharges.map(c => `${c.reason}: ${c.amount}`).join(', ')}` : 
        null;

      // Accept the service request
      await serviceRequestService.acceptServiceRequest(serviceRequest.id, providerNotes);
      
      // If there are additional charges, update the total price
      if (additionalCharges.length > 0) {
        await serviceRequestService.updateServiceRequestStatus(serviceRequest.id, {
          totalEstimatedPrice: updatedTotalPrice,
          additionalCharges: additionalCharges
        });
      }
      
      Alert.alert(
        'Success',
        'Service request accepted successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error accepting service request:', error);
      Alert.alert('Error', error.message || 'Failed to accept service request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    Alert.alert(
      'Reject Service Request',
      'Are you sure you want to reject this service request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // Pass string directly, not object
              await serviceRequestService.rejectServiceRequest(
                serviceRequest.id, 
                'Request rejected by service provider'
              );
              
              Alert.alert(
                'Success',
                'Service request rejected.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              console.error('Error rejecting service request:', error);
              Alert.alert('Error', error.message || 'Failed to reject service request');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const AddChargeModal = () => (
    <Modal
      visible={showAddChargeModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Additional Charge</Text>
            <TouchableOpacity
              onPress={() => setShowAddChargeModal(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount ($)</Text>
            <TextInput
              style={styles.textInput}
              value={newChargeAmount}
              onChangeText={setNewChargeAmount}
              placeholder="Enter amount"
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Reason</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={newChargeReason}
              onChangeText={setNewChargeReason}
              placeholder="Enter reason for additional charge"
              multiline={true}
              numberOfLines={3}
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowAddChargeModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.addButton]}
              onPress={addAdditionalCharge}
            >
              <Text style={styles.addButtonText}>Add Charge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Request Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Request Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Request Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="confirmation-number" size={20} color={colors.primary} />
              <Text style={styles.infoLabel}>Booking ID:</Text>
              <Text style={styles.infoValue}>{serviceRequest.bookingId}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="schedule" size={20} color={colors.primary} />
              <Text style={styles.infoLabel}>Scheduled:</Text>
              <Text style={styles.infoValue}>
                {formatDate(serviceRequest.scheduledDate)} at {formatTime(serviceRequest.scheduledTime)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="person" size={20} color={colors.primary} />
              <Text style={styles.infoLabel}>Customer:</Text>
              <Text style={styles.infoValue}>{serviceRequest.vehicleOwnerName}</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color={colors.primary} />
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{serviceRequest.vehicleOwnerPhone}</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="directions-car" size={20} color={colors.primary} />
              <Text style={styles.infoLabel}>Vehicle:</Text>
              <Text style={styles.infoValue}>
                {serviceRequest.vehicleBrandName} {serviceRequest.vehicleModelName} ({serviceRequest.vehicleYear})
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="credit-card" size={20} color={colors.primary} />
              <Text style={styles.infoLabel}>License Plate:</Text>
              <Text style={styles.infoValue}>{serviceRequest.vehicleLicensePlate}</Text>
            </View>
          </View>
        </View>

        {/* Special Instructions */}
        {serviceRequest.specialInstructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsText}>{serviceRequest.specialInstructions}</Text>
            </View>
          </View>
        )}

        {/* Payment Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Breakdown</Text>
          
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Base Service Cost</Text>
              <Text style={styles.paymentAmount}>${serviceRequest.totalEstimatedPrice.toFixed(2)}</Text>
            </View>

            {/* Additional Charges */}
            {additionalCharges.map((charge) => (
              <View key={charge.id} style={styles.additionalChargeRow}>
                <View style={styles.chargeInfo}>
                  <Text style={styles.chargeReason}>{charge.reason}</Text>
                  <Text style={styles.chargeAmount}>+${charge.amount.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeAdditionalCharge(charge.id)}
                  style={styles.removeChargeButton}
                >
                  <Icon name="close" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Additional Charge Button */}
            <TouchableOpacity
              style={styles.addChargeButton}
              onPress={() => setShowAddChargeModal(true)}
            >
              <Icon name="add" size={20} color={colors.primary} />
              <Text style={styles.addChargeText}>Add Additional Charge</Text>
            </TouchableOpacity>

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Estimated Price</Text>
              <Text style={styles.totalAmount}>${updatedTotalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={handleReject}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Icon name="cancel" size={20} color={colors.white} />
              <Text style={styles.rejectButtonText}>Reject</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={handleAccept}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Icon name="check-circle" size={20} color={colors.white} />
              <Text style={styles.acceptButtonText}>Accept</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <AddChargeModal />
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
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: spacing.md,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: spacing.sm,
    minWidth: 80,
  },
  infoValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginLeft: spacing.sm,
  },
  instructionsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
  },
  instructionsText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
  },
  paymentCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  paymentLabel: {
    color: colors.white,
    fontSize: 14,
  },
  paymentAmount: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  additionalChargeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: spacing.sm,
  },
  chargeInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chargeReason: {
    color: colors.primary,
    fontSize: 13,
    flex: 1,
  },
  chargeAmount: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '500',
    marginRight: spacing.sm,
  },
  removeChargeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addChargeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  totalLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginHorizontal: spacing.sm,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  acceptButton: {
    backgroundColor: colors.success,
  },
  rejectButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  acceptButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.xl,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
    color: colors.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  cancelButton: {
    backgroundColor: colors.textSecondary,
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ServiceRequestPreviewScreen;
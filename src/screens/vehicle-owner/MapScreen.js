import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  Text, 
  TouchableOpacity,
} from 'react-native';
import { MapView, Marker } from '../../components/maps/PlatformMap';
import * as Location from 'expo-location';
import { serviceProviderService } from '../../services/api/serviceProviderService';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
  });
  
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const fetchNearbyProviders = async (userLat, userLng) => {
    setLoading(true);
    setError(null);
    
    try {   
      const data = await serviceProviderService.getNearbyProviders(userLat, userLng, 25);
      console.log("data",data);
      
      if (data.success) {
        setProviders(data.providers || []);
      } else {
        setError('Failed to fetch service providers');
        console.error('API Error:', data);
      }
    } catch (error) {
      console.error('Network Error:', error);
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout - check your internet connection');
      } else if (error.code === 'ECONNREFUSED') {
        setError('Unable to connect to server');
      } else {
        setError('Network error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to find nearby services');
        await fetchNearbyProviders(6.9271, 79.8612);
        return;
      }

      console.log('Getting current location...');
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });
      
      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      
      console.log('User location:', newLocation);
      setLocation(newLocation);
      
      await fetchNearbyProviders(newLocation.latitude, newLocation.longitude);
      
    } catch (error) {
      Alert.alert(
        'Location Error', 
        'Unable to get your current location. Showing services in Colombo area.',
        [{ text: 'OK' }]
      );
      await fetchNearbyProviders(6.9271, 79.8612);
    }
  };

  const refreshProviders = () => {
    fetchNearbyProviders(location.latitude, location.longitude);
  };

  const handleMarkerPress = (provider, event) => {
    setSelectedProvider({
      ...provider,
      x: event.nativeEvent.coordinate.latitude,
      y: event.nativeEvent.coordinate.longitude
    });
  };

  const handleProviderCardPress = () => {
    if (selectedProvider) {
      navigation.navigate('ServiceCenterDetail', {
        serviceCenter: selectedProvider
      });
    }
  };

  const handleCloseCard = () => {
    setSelectedProvider(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomEnabled={true}
        scrollEnabled={true}
        zoomControlEnabled={true}
        showsCompass={false}
        showsScale={false}
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={handleCloseCard}
      >
        {/* Current user location marker */}
        <Marker
          coordinate={location}
          title="Your Location"
          description="You are here"
          pinColor="blue"
        />

        {/* Service provider markers */}
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            coordinate={{
              latitude: provider.latitude,
              longitude: provider.longitude,
            }}
            pinColor="red"
            onPress={(event) => handleMarkerPress(provider, event)}
            tracksViewChanges={false}
          />
        ))}
      </MapView>

      {/* Provider Info Card */}
      {selectedProvider && (
        <View style={styles.providerCard}>
          <TouchableOpacity 
            style={styles.cardContent}
            onPress={handleProviderCardPress}
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{selectedProvider.businessName}</Text>
                <Text style={styles.providerDistance}>{selectedProvider.distance}km away</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleCloseCard}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={14} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.providerStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{selectedProvider.yearsOfExperience}</Text>
                <Text style={styles.statLabel}>Years Experience</Text>
              </View>
                <TouchableOpacity 
                  style={styles.statItem}
                  onPress={() => Linking.openURL(`tel:${selectedProvider.phoneNumber || selectedProvider.contactNumber}`)}
                  activeOpacity={0.7}
                >
                  <Icon name="phone" size={16} color="#007AFF" />
                  <Text style={styles.statLabel}>Call Now</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.tapText}>Tap to book services</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Finding nearby services...</Text>
        </View>
      )}

      {/* Error overlay with retry */}
      {error && (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refreshProviders} style={styles.retryButton}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  providerCard: {
    position: 'absolute',
    top: 280,
    left: 70,
    right: 20,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    width: 250,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  cardContent: {
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
    lineHeight: 18,
  },
  providerDistance: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  closeButton: {
    padding: 6,
    marginTop: -6,
    marginRight: -6,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
  },
  closeButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  providerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    paddingVertical: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5E5',
  },
  tapText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 3,
  },
  arrowIcon: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  errorOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
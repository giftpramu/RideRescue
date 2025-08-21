import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { MapView, Marker } from '../../components/maps/PlatformMap';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [location, setLocation] = useState({
    latitude: 6.9271,
    longitude: 79.8612,
  });

  const serviceProviders = [
    {
      id: 1,
      name: "Quick Fix Auto",
      latitude: 6.9271,
      longitude: 79.8612,
      service: "Engine Repair"
    },
    {
      id: 2,
      name: "Mobile Mechanic Pro",
      latitude: 6.9344,
      longitude: 79.8428,
      service: "Tyre Service"
    },
    {
      id: 3,
      name: "Road Rescue Lanka",
      latitude: 6.9147,
      longitude: 79.8731,
      service: "Towing Service"
    }
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      console.log('Error getting location:', error);
    }
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
      >
        {/* Current user location */}
        <Marker
          coordinate={location}
          title="Your Location"
          description="You are here"
          pinColor="blue"
        />

        {/* Service providers */}
        {serviceProviders.map((provider) => (
          <Marker
            key={provider.id}
            coordinate={{
              latitude: provider.latitude,
              longitude: provider.longitude,
            }}
            title={provider.name}
            description={provider.service}
            pinColor="red"
          />
        ))}
      </MapView>
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
});

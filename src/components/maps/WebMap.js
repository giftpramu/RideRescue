import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function WebMap({ children, initialRegion, style }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Service Providers Map</Text>
        <Text style={styles.subtitle}>
          📍 {initialRegion?.latitude.toFixed(4)}, {initialRegion?.longitude.toFixed(4)}
        </Text>
        <Text style={styles.note}>
          💡 Testing on web - Full map will appear on mobile device
        </Text>
      </View>
      
      <ScrollView style={styles.markersContainer}>
        {children}
      </ScrollView>
    </View>
  );
}

export function WebMarker({ title, description, coordinate, pinColor }) {
  const markerColor = pinColor === 'blue' ? '#2196F3' : '#F44336';
  
  return (
    <View style={[styles.marker, { borderLeftColor: markerColor }]}>
      <Text style={styles.markerTitle}>
        📍 {title}
      </Text>
      {description && (
        <Text style={styles.markerDesc}>{description}</Text>
      )}
      <Text style={styles.markerCoords}>
        Lat: {coordinate.latitude.toFixed(4)}, Lng: {coordinate.longitude.toFixed(4)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  note: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  markersContainer: {
    flex: 1,
    padding: 15,
  },
  marker: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  markerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  markerDesc: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  markerCoords: {
    fontSize: 12,
    color: '#999',
  },
});
import React from 'react';
import { Platform } from 'react-native';

// Platform-specific imports (JavaScript way)
let MapComponent;
let MarkerComponent;

if (Platform.OS === 'web') {
  // For web, use our custom web map
  const WebMapModule = require('./WebMap');
  MapComponent = WebMapModule.default;
  MarkerComponent = WebMapModule.WebMarker;
} else {
  // For mobile, use react-native-maps
  try {
    const Maps = require('react-native-maps');
    MapComponent = Maps.default;
    MarkerComponent = Maps.Marker;
  } catch (error) {
    console.log('react-native-maps not available, using web fallback');
    const WebMapModule = require('./WebMap');
    MapComponent = WebMapModule.default;
    MarkerComponent = WebMapModule.WebMarker;
  }
}

export const MapView = MapComponent;
export const Marker = MarkerComponent;
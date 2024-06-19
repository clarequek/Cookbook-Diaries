import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const GroceryStoreLocator = () => {
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        getLocation();
      }
    };

    const getLocation = async () => {
      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;
      setLocation({ latitude, longitude });
      fetchNearbyStores(latitude, longitude);
    };

    requestLocationPermission();
  }, []);

  const fetchNearbyStores = async (latitude, longitude) => {
    try {
      const overpassApiUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:1500,${latitude},${longitude})[shop=supermarket];out;`;
      const response = await axios.get(overpassApiUrl);
      setStores(response.data.elements);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={location}
            title="You are here"
          />
          {stores.map((store, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: store.lat,
                longitude: store.lon,
              }}
              title="Grocery Store"
              description={`ID: ${store.id}`}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
  },
});

export default GroceryStoreLocator;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

const GroceryStoreLocator = () => {
  const navigation = useNavigation()
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      fetchGroceryStores(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchGroceryStores = async (latitude, longitude) => {
    try {
      const overpassApiUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:1500,${latitude},${longitude})[shop=supermarket];out body;`;
      const response = await axios.get(overpassApiUrl);
      setStores(response.data.elements);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View 
      style={styles.header}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButtonWrapper} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" color="#000000" size={25} />
        </TouchableOpacity>
      
        {/* Title*/}
        <Text className = 'font-extrabold text-[#ebb01a]'      
        style={styles.title}>
          Locate grocery stores!
        </Text>
      </View>
      {errorMsg ? (
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      ) : location ? (
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
              title={store.tags?.name || 'Grocery Store'}
              description={store.tags?.['addr:street'] || 'No address available'}
              pinColor="red"
            />
          ))}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5e6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff5e6',
  },
  backButtonWrapper: {
    marginRight: 10,
    padding: 5,
  },
  title: {
    flex: 1,
    fontSize: 24,
  },
  map: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
  },
  errorMsg: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default GroceryStoreLocator;

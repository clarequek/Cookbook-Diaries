import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { fonts } from '../utilities/fonts';
import { colors } from '../utilities/colors';
import { ChevronLeftIcon } from 'react-native-heroicons/outline'

const OPENROUTESERVICE_API_KEY = '5b3ce3597851110001cf62486ab0fa18e3874fc18d55f8fac2631085';

const GroceryStoreLocator = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [directions, setDirections] = useState(null);
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

  const fetchDirections = async (originLat, originLon, destLat, destLon) => {
    try {
      const response = await axios.post(
        'https://api.openrouteservice.org/v2/directions/foot-walking',
        {
          coordinates: [[originLon, originLat], [destLon, destLat]],
          format: 'json',
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTESERVICE_API_KEY}`,
          },
        }
      );
      const route = response.data.routes[0];
      const duration = Math.ceil(route.segments[0].duration / 60); // duration in minutes
      setDirections({ duration });
    } catch (error) {
      console.error(error);
      setDirections({ duration: 0 });
    }
  };

  const handleMarkerPress = (store) => {
    setSelectedStore(store);
    fetchDirections(
      location.latitude,
      location.longitude,
      store.lat,
      store.lon
    );
  };

  // Notification to teach users how to press the pin
  useEffect(() => {
    Alert.alert('Tip', 'The red pin is your current location! Tap on a pink pin to see store details and estimated walking time.');
  }, []);

  return (
    //Back button and title 
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          className="p-2 rounded-full bg-white ml-1"
          onPress = {() => navigation.goBack()}
        >
          <ChevronLeftIcon
            size={hp(2.5)}
            color={colors.pink}
            strokeWidth={4.5}
          />
        </TouchableOpacity>
        <Text className='font-extrabold' style={styles.title}>Grocery stores near you:</Text>
      </View>


      {errorMsg ? (
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      ) : location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
        >
          <Marker coordinate={location} title="You are here" pinColor='red' />
          {stores.map((store, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: store.lat, longitude: store.lon }}
              title={store.tags?.name || 'Grocery Store'}
              description={store.tags?.['addr:street'] || 'No address available'}
              pinColor="#ff8271"
              onPress={() => handleMarkerPress(store)}
            />
          ))}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
      {selectedStore && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>{selectedStore.tags?.name || 'Grocery Store'}</Text>
          <Text style={styles.infoText}>{"Address : " + selectedStore.tags?.['addr:street'] || 'No address available'}</Text>
          <Text style={styles.infoText}>Estimated walking time: {directions?.duration} min</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.cream,
    justifyContent: 'center',
  },
  backButtonWrapper: {
    marginRight: 10,
    padding: 5,
  },
  title: {
    flex: 1,
    fontSize: hp(3),
    color: colors.pink,
    fontFamily: fonts.Bold,
    textAlign: 'center',
  },
  map: {
    margin: 10,
    borderRadius: 10,
    height: '65%' // Increase the height of the map
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
  infoContainer: {
    backgroundColor: colors.cream,
    borderRadius: 10,
    margin: 5,
    height: '15%', // Reduce the height of the info container
  },
  infoTitle: {
    fontSize: hp(2.8),
    fontFamily: fonts.Bold,
    marginBottom: 5,
    color: colors.pink,
  },
  infoText: {
    fontSize: hp(2),
    marginBottom: 5,
    fontFamily: fonts.Regular
  },
});

export default GroceryStoreLocator;

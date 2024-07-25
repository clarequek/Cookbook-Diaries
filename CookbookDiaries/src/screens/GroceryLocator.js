import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { fonts } from '../utilities/fonts';
import { colors } from '../utilities/colors';
import Loading from '../components/loading';

const OPENROUTESERVICE_API_KEY = '5b3ce3597851110001cf62486ab0fa18e3874fc18d55f8fac2631085';

const GroceryStoreLocator = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [topStores, setTopStores] = useState([]);

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
    Alert.alert('Tip', 'The red pin is your current location! The pink pins are grocery stores near you.');
  }, []);

  const fetchGroceryStores = async (latitude, longitude) => {
    try {
      const overpassApiUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:1500,${latitude},${longitude})[shop=supermarket];out body;`;
      const response = await axios.get(overpassApiUrl);
      const stores = response.data.elements;
      setStores(stores);
      calculateWalkingTimes(stores, latitude, longitude);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateWalkingTimes = async (stores, originLat, originLon) => {
    try {
      const storeDistances = await Promise.all(stores.map(async (store) => {
        const response = await axios.post(
          'https://api.openrouteservice.org/v2/directions/foot-walking',
          {
            coordinates: [[originLon, originLat], [store.lon, store.lat]],
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
        return { ...store, duration };
      }));

      storeDistances.sort((a, b) => a.duration - b.duration);
      setTopStores(storeDistances.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button and title */}
      <View style={styles.header}>
        <Text className='font-extrabold' style={styles.title}>Grocery stores near you:</Text>
      </View>

      {/* Map */}
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
              description={store.tags?.['addr:street'] ? store.tags['addr:street'] : 'No address available'}
              pinColor="#ff8271"
            />
          ))}
        </MapView>
      ) : (
        // Loading component
        <Loading size="large" color={colors.pink} /> 
      )}

      {/* Display top 3 closest stores */}
      {topStores.length > 0 && (
        <View style={styles.topStoresContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.topStoresTitle}>Top 3 Closest Grocery Stores:</Text>
            {topStores.map((item, index) => (
              <View key={index} style={styles.storeItem}>
                <Text style={styles.storeName}>{item.tags?.name || 'Grocery Store'}</Text>
                <Text style={styles.storeAddress}>{"Address: " + (item.tags?.['addr:street'] ? item.tags['addr:street'] : 'No address available')}</Text>
                <Text style={styles.storeDuration}>Estimated walking time: {item.duration} min</Text>
              </View>
            ))}
          </ScrollView>
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
    height: '53%' //adjust height of map 
  },
  errorMsg: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  topStoresContainer: {
    flex: 1,
    backgroundColor: 'white', 
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  topStoresTitle: {
    fontSize: hp(2.3),
    fontFamily: fonts.Bold,
    marginBottom: 10,
    color: colors.pink,
  },
  storeItem: {
    marginBottom: 10,
  },
  storeName: {
    fontSize: hp(2),
    fontFamily: fonts.Bold,
    color: colors.darkgrey,
  },
  storeAddress: {
    fontSize: hp(1.5),
    fontFamily: fonts.Regular,
  },
  storeDuration: {
    fontSize: hp(1.5),
    fontFamily: fonts.Regular,
  },
});

export default GroceryStoreLocator;

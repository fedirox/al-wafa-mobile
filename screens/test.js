import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, Dimensions, TextInput ,Alert} from 'react-native';
import MapView from "react-native-maps";
import Constants from 'expo-constants';
import * as Location from 'expo-location';
export default function CreateProfile() {
  const [location, setLocation] = useState({
    coords: {
      latitude: 36.803998,
      longitude: 10.1698,
      latitudeDelta: 10,
      longitudeDelta: 30,
    },
  });
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const getGeocode = () => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      setErrorMsg(
        "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      );
    } else {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
        }

        let location = await Location.getCurrentPositionAsync({});
        if (location) setLocation(location);
        let response = await Location.geocodeAsync(destination);
        console.log(response);

        // from=from[0]
        // if (from){
        //   setFrom(from.street +" "+from.city +" "+from.country)
        // }
      })();
    }
  };

  useEffect(() => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      setErrorMsg(
        "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      );
    } else {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
        }

        let location = await Location.getCurrentPositionAsync({});
        if (location) setLocation(location);
        let from = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        from = from[0];
        if (from) {
          setFrom(from.street + " " + from.city + " " + from.country);
        }
      })();
    }
  });

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  const initial = {
    latitude: 36.803998,
    longitude: 10.1698,
    latitudeDelta: 0.015 * 3,
    longitudeDelta: 0.0121 * 3,
  };
  const marker = {
    latitude: coords.latitude,
    longitude: coords.longitude,
  };
  const marker2 = {
    latitude: 34,
    longitude: 9.3,
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.centerText}>
          <Text>Position Actuelle</Text>
        </View>

        <TextInput
          style={styles.textInput}
          defaultValue={from}
          onChangeText={(text) => {
            setFrom(text);
          }}
        />
        <View style={styles.centerText}>
          <Text>Choisir votre distination</Text>
        </View>
      </View>
      <TextInput
        style={styles.textInput}
        value={destination}
        onChangeText={(text) => setDestination(text)}
        onEndEditing={() => getGeocode()}
      />
      {errorMsg ? (
        <Text style={styles.paragraph}>{text}</Text>
      ) : (
        <MapView style={styles.mapStyle} initialRegion={initial}>
          <MapView.Marker
            coordinate={marker}
            title={"title"}
            description={"description"}
          />
          <MapView.Marker
            coordinate={marker2}
            title={"title"}
            description={"description"}
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#A1EDBF",
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  header: {
    height: 100,
  },
  backIcon: {
    fontSize: 25,
    color: "blue",
  },
  textInput: {
    backgroundColor: "#E6E8E9",
    borderRadius: 10,
    color: "#8E8E93",
    fontSize: 17,
    height: 43,
    margin: 8,
  },

  centerText: {
    flex: 5,
    flexDirection: "row",
    margin: 8,
    alignItems: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

import React, { useState, useEffect } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
} from "react-native";
import MapView from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
export default function MapGeol() {
  const [mapLocation, setMapLocation] = useState({
    coords: {
      latitude: 36.803998,
      longitude: 10.1698,
      latitudeDelta: 0.015 * 3,
      longitudeDelta: 0.0121 * 3,
    },
  });
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [myPosition, setMyPosition] = useState({
    active: false,
    location: {
      latitude: 36.803998,
      longitude: 10.1698,
    },
    name: "",
  });
  const locateMe = () => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      setErrorMsg(
        "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      );
    } else {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
        } else {
          let location = await  Location.getCurrentPositionAsync({});
          console.log(location);
          if (location) {
            setMapLocation({
              coords: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.015 * 3,
                longitudeDelta: 0.0121 * 3,
              },
            });
            let { name } = await getLocationName(
              location.coords.latitude,
              location.coords.longitude
            );
            setMyPosition({
              active: myPosition.active,
              location: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
              name: name,
            });
          } else {
            console.log("none");
          }
        }
      })();
    }
  };
  const getLocationName = async (latitude, longitude) => {
    let response = await Location.reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude,
    });
    if (response) {
      response = response[0];
    }
    return response;
  };

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (mapLocation) {
    text = JSON.stringify(mapLocation);
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.centerText}>
          <Text>Position Actuelle</Text>
        </View>

        <TextInput
          style={styles.textInput}
          value={from}
          onChangeText={(text) => {
            setFrom(text);
          }}
        />
        <Button title="locate me" onPress={locateMe} />
        <View style={styles.centerText}>
          <Text>Choisir votre distination</Text>
        </View>
      </View>
      <TextInput
        style={styles.textInput}
        value={destination}
        onChangeText={(text) => setDestination(text)}
      />
      {errorMsg ? (
        <Text style={styles.paragraph}>{text}</Text>
      ) : (
        <MapView
          style={styles.mapStyle}
          initialRegion={mapLocation.coords}
          region={mapLocation.coords}
          onPress={(location) => console.log(location.nativeEvent)}
        >
          <MapView.Marker
            coordinate={myPosition.location}
            title={myPosition.name}
            description={"description"}
            onDrag={(e) => {
              console.log("dragEnd", e.nativeEvent.coordinate);
            }}
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A1EDBF",
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
    width: "100%",
    height: "100%",
  },
});

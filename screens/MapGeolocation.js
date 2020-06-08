import React, { useState, useEffect } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
export default function MapGeol() {
  const [mapLocation, setMapLocation] = useState({
    coords: {
      latitude: 36.803998,
      longitude: 10.1698,
      latitudeDelta: 0.015 * 3,
      longitudeDelta: 0.0121 * 3,
    },
  });
  const [activePosition, setActivePosition] = useState("from");
  const [myPosition, setMyPosition] = useState({
    location: {
      latitude: 36.80396,
      longitude: 10.169,
    },
  });
  const [myPositionName, setMyPositionName] = useState("");
  const [myDesitination, setMyDesitination] = useState({
    location: {
      latitude: 36.803998,
      longitude: 10.158,
    },
  });
  const [myDesitinationName, setMyDesitinationName] = useState("");
  changePostion = (location) => {
    switch (activePosition) {
      case "from":
        changeMyPosition(location);
        break;
      case "destination":
        changeDestination(location);
    }
  };
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
          let location = await Location.getCurrentPositionAsync({});
          if (location) {
            setMapLocation({
              coords: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.015 * 3,
                longitudeDelta: 0.0121 * 3,
              },
            });
            changeMyPosition(location.coords);
          } else {
            console.log("none");
          }
        }
      })();
    }
  };
  const changeDestination = (coordinate) => {
    setMyDesitination({
      location: coordinate,
    });
    console.log(myDesitination);
  };

  const changeMyPosition = (coordinate) => {
    setMyPosition({
      location: coordinate,
    });
    console.log(myPosition);
  };

  

  return (
    <View style={styles.container}>
      <View style={styles.from}>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input}></TextInput>
          <FontAwesomeIcon icon={faLocationArrow} onPress={locateMe}></FontAwesomeIcon>
          <View
            style={
              activePosition === "from"
                ? styles.activerPointer
                : styles.pointerWrapper
            }
            onTouchEnd={()=>setActivePosition("from")}
          >
            <Image
              style={styles.pointer}
              source={require("../assets/mylocation.png")}
            ></Image>
          </View>
        </View>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input}></TextInput>
          <View
            style={
              activePosition === "destination"
                ? styles.activerPointer
                : styles.pointerWrapper
            }
            onTouchEnd={()=>setActivePosition("destination")}
          >
            <Image
              style={styles.pointer}
              source={require("../assets/location.png")}
            ></Image>
          </View>
        </View>
      </View>
      <MapView
        style={styles.mapStyle}
        initialRegion={mapLocation.coords}
        region={mapLocation.coords}
        onRegionChange={(region) => setMapLocation(region)}
        onPress={(event) => changePostion(event?.nativeEvent.coordinate)}
      >
        <Marker
          coordinate={myPosition.location}
          image={require("../assets/mylocation.png")}
          title={myPositionName}
          description={"from"}
          onDragEnd={(event) => changeMyPosition(event?.nativeEvent.coordinate)}
          draggable={true}
        />
        <Marker
          image={require("../assets/location.png")}
          style={{ backgroundColor: "black" }}
          coordinate={myDesitination.location}
          title={myDesitinationName}
          description={"to"}
          onDragEnd={(event) =>
            changeDestination(event?.nativeEvent.coordinate)
          }
          draggable={true}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  from: {
    backgroundColor: "#fff",
    width: '100%',
    height: 160,
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  input: {
    backgroundColor: "#fff",
    width: "80%",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
    padding: 10,
  },
  activerPointer: {
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "gray",
    marginLeft: 10,
    padding: 10,
  },
  pointerWrapper: {
    borderRadius: 20,
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
    padding: 10,
  },
  pointer: {
    width: 20,
    alignSelf: "center",
    height: 20,
  },
  mapStyle: {
    width: "100%",
    height: 450,
  },
});

import React, { useState, useEffect } from "react";
import {
  Platform,
  View,
  StyleSheet,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { GEOCODE_URL, GEO_NAMES, GEO_NAMES_OPT } from "react-native-dotenv";
import Axios from "axios";

export default function MapGeol({ navigation }) {
  useEffect(() => {
    locateMe();
  }, []);

  const [mapLocation, setMapLocation] = useState({
    coords: {
      latitude: 36.803998,
      longitude: 10.1698,
      latitudeDelta: 0.015 * 3,
      longitudeDelta: 0.0121 * 3,
    },
  });
  const [myPosition, setMyPosition] = useState({
    location: {
      latitude: 0,
      longitude: 0,
    },
  });

  const [myDesitination, setMyDesitination] = useState({
    location: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const [myPositionName, setMyPositionName] = useState("");
  const [myDesitinationName, setMyDesitinationName] = useState("");

  const [activePosition, setActivePosition] = useState("from");
  const [loading, setLoading] = useState(false);

  changePostion = (location) => {
    Axios.get(
      `${GEOCODE_URL}/reverseGeocode?location=${location.longitude},${location.latitude}&langCode=fr&&f=json`
    )
      .then((response) => {
        if (
          response.data.address &&
          response.data.address.CountryCode === "TUN"
        ) {
          switch (activePosition) {
            case "from":
              setMyPositionName(response.data.address.LongLabel);
              setMyPosition({
                location: location,
              });
              break;
            case "destination":
              setMyDesitinationName(response.data.address.LongLabel);
              setMyDesitination({
                location: location,
              });
              break;
          }
        }
      })
      .catch((err) => console.log(err));
  };
  const locateMe = () => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      console.log(
        "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      );
    } else {
      (async () => {
        setLoading(true);
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
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
            setActivePosition("from");
            changePostion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });

            setLoading(false);
          } else {
            console.log("none");
          }
        }

        setLoading(false);
      })();
    }
  };
  const confirmDestination = () => {
    if (
      myDesitination.location.latitude === 0 ||
      myDesitination.location.longitude === 0
    ) {
      Alert.alert(
        "Alert",
        "Choisissez votre destination",
        [{ text: "OK", onPress: () => { } }],
        {
          cancelable: false,
        }
      );
    } else if (
      myPosition.location.latitude === 0 ||
      myPosition.location.longitude === 0
    ) {
      Alert.alert(
        "Alert",
        "Choisissez votre point de depart",
        [{ text: "OK", onPress: () => { } }],
        {
          cancelable: false,
        }
      );
    } else {
      const travel = {
        from: {
          location: myPosition.location,
          street: myPositionName,
        },
        to: {
          location: myDesitination.location,
          street: myDesitinationName,
        },
      };

      navigation.navigate("Confirmation", { travel: travel });
    }
  };

  const changeFromSuggestion = (text) => {
    Axios.get(GEO_NAMES + text + GEO_NAMES_OPT).then((response) => {
      if (Array.isArray(response.data.suggestions)) {
        let suggs = response.data.suggestions
          .filter((suggestion) => !suggestion.isCollection)
          .map((suggestion) => suggestion.text);
        setFromSuggestions(suggs);
      }
    });
  };
  const changeDestinationSuggestion = (text) => {
    Axios.get(GEO_NAMES + text + GEO_NAMES_OPT).then((response) => {
      if (Array.isArray(response.data.suggestions)) {
        let suggs = response.data.suggestions
          .filter((suggestion) => !suggestion.isCollection)
          .map((suggestion) => suggestion.text);
        setDestinationSuggestions(suggs);
      }
    });
  };
  const getLocationByAddress = async (address) => {
    Axios.get(
      `${GEOCODE_URL}/findAddressCandidates?countryCode=TUN&SingleLine=${address}&f=pjson`
    ).then((response) => {
      if (response.data.candidates[0].location) {
        const { x, y } = response.data.candidates[0].location
        setMapLocation({
          coords: {
            latitude: y,
            longitude: x,
            latitudeDelta: 0.015 * 3,
            longitudeDelta: 0.0121 * 3,
          },
        })
        changePostion({ latitude: y, longitude: x });
        setFromSuggestions([])
        setDestinationSuggestions([])
      }
    }).catch((err) => console.log(err)
    )
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quelle est votre destination</Text>
        <View style={styles.formWrapper}>
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <TextInput
                onFocus={() => { setDestinationSuggestions([]); setFromSuggestions([]) }}
                value={myPositionName}
                placeholder="Point de depart"
                style={styles.input}
                onChangeText={(text) => {
                  setMyPositionName(text);
                  changeFromSuggestion(text);
                }}
                onTouchEnd={() => setActivePosition("from")}
              ></TextInput>
              <FlatList
                style={styles.autocompleteContainer}
                data={fromSuggestions}
                renderItem={({ item, i }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => getLocationByAddress(item)}
                  >
                    <Image
                      style={styles.suggestionPointer}
                      source={require("../assets/location.png")} /><Text style={styles.suggestion}>{item}</Text>

                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              ></FlatList>
              <View
                style={
                  activePosition === "from"
                    ? styles.activerPointer
                    : styles.pointerWrapper
                }
                onTouchEnd={() => setActivePosition("from")}
              >
                <Image
                  style={styles.pointer}
                  source={require("../assets/mylocation.png")}
                ></Image>
              </View>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                onFocus={() => { setDestinationSuggestions([]); setFromSuggestions([]) }}
                value={myDesitinationName}
                onChange={(e) => {
                  setMyDesitinationName(e.nativeEvent.text);
                  changeDestinationSuggestion(e.nativeEvent.text);
                }}
                placeholder="Destination"
                style={styles.input}
                onTouchEnd={() => setActivePosition("destination")}
              ></TextInput>
              <FlatList
                style={styles.autocompleteDestinationContainer}
                data={destinationSuggestions}
                renderItem={({ item, i }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => getLocationByAddress(item)}
                  >
                    <Image
                      style={styles.suggestionPointer}
                      source={require("../assets/location.png")} /><Text style={styles.suggestion}>{item}</Text>

                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
              ></FlatList>
              <View
                style={
                  activePosition === "destination"
                    ? styles.activerPointer
                    : styles.pointerWrapper
                }
                onTouchEnd={() => setActivePosition("destination")}
              >
                <Image
                  style={styles.pointer}
                  source={require("../assets/location.png")}
                ></Image>
              </View>
            </View>
          </View>
          <View style={styles.iconWrapper}>
            <FontAwesomeIcon
              icon={faLocationArrow}
              onPress={locateMe}
            ></FontAwesomeIcon>
          </View>
        </View>
      </View>
      <View style={styles.body}>
        {loading ? (
          <View style={styles.loadingBody}>
            <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="#f26522" />
            </View>
          </View>
        ) : (
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
                onDragStart={() => setActivePosition("from")}
                onDragEnd={(event) =>
                  changePostion(event?.nativeEvent.coordinate)
                }
                draggable={true}
                onPress={() => setActivePosition("from")}
              />
              <Marker
                image={require("../assets/location.png")}
                style={{ backgroundColor: "black" }}
                coordinate={myDesitination.location}
                onDragStart={() => setActivePosition("destination")}
                onDragEnd={(event) =>
                  changePostion(event?.nativeEvent.coordinate)
                }
                draggable={true}
                onPress={() => setActivePosition("destination")}
              />
            </MapView>
          )}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButtonWrapper}>
          <Text
            onPress={() => confirmDestination()}
            style={styles.submitButton}
          >
            Suivant
          </Text>
        </TouchableOpacity>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 50,
  },
  header: {
    flexDirection: "column",
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 16,
  },

  formWrapper: {
    flexDirection: "row",
  },
  iconWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },

  inputWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    position: "relative"
  },
  input: {
    width: "75%",
    fontSize: 14,
    borderColor: "gray",
    borderWidth: 2,
    borderColor: "#f26522",
    borderRadius: 10,
    padding: 5,
  },
  autocompleteContainer: {
    position: "absolute",
    left: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "column",
    backgroundColor: "#fff",
    borderColor: "gray",
    right: 0,
    top: 45,
    zIndex: 1
  },
  autocompleteDestinationContainer: {
    flex: 1,
    position: "absolute",
    left: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "column",
    backgroundColor: "#fff",
    borderColor: "gray",
    width: "100%",
    top: 45,
    zIndex: 1
  },
  item: {
    flex: 1,
    flexDirection: "row",
    padding: 15
  },
  suggestionPointer: {
    width: 20,
    height: 20,
    margin: "auto",
    marginRight: 15
  },
  suggestion: {
    fontSize: 13,
    width: "80%",
    fontStyle: "italic"
  },
  activerPointer: {
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#E7E3E0",
    marginLeft: 10,
    padding: 10,
  },
  pointerWrapper: {
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
  body: {
    flex: 1,
    backgroundColor: "#000",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  loadingBody: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  mapStyle: {
    width: "100%",
    height: "100%",
  },
  footer: {
    flexDirection: "column-reverse",
  },
  submitButtonWrapper: {
    width: "100%",
  },
  submitButton: {
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#fff",
    padding: 10,
    width: "100%",
    color: "#f26522",
    borderColor: "#f26522",
    borderWidth: 2,
    fontSize: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

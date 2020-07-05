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
  FlatList
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { GEO_NAMES, GEO_NAMES_OPT } from "react-native-dotenv";
import Axios from "axios";
const adresses = [
  "English Sydney Australia", "Estonian Sydney Australia", "Esperanto Sydney Australia"]
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
  const [suggestions, setSuggestions] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [myPositionName, setMyPositionName] = useState("");
  const [myDesitinationName, setMyDesitinationName] = useState("");

  const [activePosition, setActivePosition] = useState("from");
  const [loading, setLoading] = useState(false);

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
            changeMyPosition({
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
  const reverseCodeMyDestination = async (coordinate) => {
    await Location.reverseGeocodeAsync(coordinate)
      .then((data) => {
        setMyDesitinationName(formatLocation(data[0]));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const reverseCodeMyPosition = async (coordinate) => {
    await Location.reverseGeocodeAsync(coordinate)
      .then((data) => {
        setMyPositionName(formatLocation(data[0]));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatLocation = (data) => {
    let location = "";
    if (data.name && !data.street) {
      location += data.name;
    } else if (!data.name && data.street) {
      location += data.street;
    } else if (data.name && data.street) {
      if (data.name === data.street) {
        location += data.name;
      } else if (/^\d+$/.test(data.name)) {
        location += `${data.name} ${data.street}`;
      } else {
        location += `${data.name}, ${data.street}`;
      }
    }
    return `${location}, ${data.region}, ${data.country}`;
  };
  const changeDestination = (coordinate) => {
    setMyDesitination({
      location: coordinate,
    });
    reverseCodeMyDestination(coordinate);
  };

  const changeMyPosition = (coordinate) => {
    setMyPosition({
      location: coordinate,
    });
    reverseCodeMyPosition(coordinate);
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

    if (errorMessage) {
    }
  };

  filterAdresses = (searchedText) => {
    return adresses.filter(function (adress) {
      return adress.street.toLowerCase().includes(searchedText.toLowerCase())
    });
  };
  const getSuggestion = (text) => {
    Axios.get(GEO_NAMES + text + GEO_NAMES_OPT).then(response => {
      if (Array.isArray(response.data.suggestions)) {
        let suggs = response.data.suggestions.filter(suggestion => !suggestion.isCollection).map(suggestion => suggestion.text)
        setSuggestions(suggs)

      }
    })
  }
  const getLocationByAddress = async (address) => {
    await Location.geocodeAsync(address)
      .then((data) => {
        const { longitude, latitude } = data[0]
        changePostion({ latitude, longitude })
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quelle est votre destination</Text>
        <View style={styles.formWrapper}>
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <TextInput
                value={myPositionName}
                placeholder="Point de depart"
                style={styles.input}
                onChangeText={text => { setMyPositionName(text); getSuggestion(text) }}
                onTouchEnd={() => setActivePosition("from")}
              ></TextInput>
              <FlatList 
              style={styles.autocompleteContainer}
                data={suggestions}
                renderItem={({ item, i }) => (
                  <TouchableOpacity style={styles.item} onPress={() => { setMyPositionName(item); getLocationByAddress(item); setSuggestions([]) }}>
                    <Text>{item}</Text>
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
                value={myDesitinationName}
                onChange={(e) => setMyDesitinationName(e.nativeEvent.text)}
                placeholder="Destination"
                style={styles.input}
                onTouchEnd={() => setActivePosition("destination")}
              ></TextInput>
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
                title={"From"}
                description={"Point de depar"}
                onDragEnd={(event) =>
                  changeMyPosition(event?.nativeEvent.coordinate)
                }
                draggable={true}
                onPress={() => setActivePosition("from")}
              />
              <Marker
                image={require("../assets/location.png")}
                style={{ backgroundColor: "black" }}
                coordinate={myDesitination.location}
                title={"To"}
                description={"Destination"}
                onDragEnd={(event) =>
                  changeDestination(event?.nativeEvent.coordinate)
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
    </View>
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
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 50,
    zIndex: 1,
    borderColor:"gray",
    borderRadius:2,

  },
  item: {
    borderTopWidth: 1,
    borderTopColor:"gray",
    backgroundColor: "white",
    borderColor: "black",
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

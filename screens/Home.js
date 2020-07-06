import React, { useState, useEffect } from "react";
import { View, StyleSheet, ImageBackground, AsyncStorage } from "react-native";
import { API_URL } from "react-native-dotenv";
import axios from "axios";

export default function Home({ navigation }) {
  const [first, setFirst] = useState(true);
  

  const loadToken = async () => {
    try {
      let token = await AsyncStorage.getItem("TOKEN");
      if (token) {
        let url = `${API_URL}/users/login`;
        await axios
          .post(
            url,
            {},
            {
              headers: { "x-auth-token": token },
            }
          )
          .then(() => {
            navigation.navigate("MapGeolocation");
          })
          .catch((error) => {
            console.log(error);
            navigation.navigate("SendNumber");
          });
      } else {
        navigation.navigate("SendNumber");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setTimeout(function () {
      setFirst(false);
    }, 2000);
    setTimeout(function () {
      loadToken();
    }, 4000);
  }, []);

  if (first) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/logo.png")}
          style={styles.image}
        ></ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.container2}>
      <ImageBackground
        source={require("../assets/welcome.png")}
        style={styles.logo}
      ></ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f26522",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 300,
  },
  container2: {
    flex: 1,
    flexDirection: "column",
  },
  logo: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  text: {
    color: "grey",
    fontSize: 30,
    fontWeight: "bold",
  },
});

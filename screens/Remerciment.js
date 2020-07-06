import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";

export default function Confirmation({ navigation }) {
  const backToMap = () => {
    navigation.navigate("MapGeolocation");
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/logo.png")}
        ></Image>
        <Text style={styles.title}>
          Nous vous remercions d'avoir choisi notre compagnie
        </Text>
        <Text style={styles.subTitle}>
          Notre chauffeur vous contactera dans quelques minutes sur votre
          téléphone
        </Text>
        <TouchableOpacity style={styles.submitButtonWrapper}>
          <Text onPress={() => backToMap()} style={styles.submitButton}>
            Retourner vers la carte
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#f26522",
    color: "#fff",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginTop: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 40,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  subTitle: {
    width: "65%",
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
  },

  submitButtonWrapper: {
    marginTop: 60,
    borderRadius: 10,
  },
  submitButton: {
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#f26522",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    color: "#fff",
    fontSize: 20,
  },
});

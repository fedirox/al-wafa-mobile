import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { goTo } from "../helpers/CostumNavigation";

export default function Confirmation({ navigation }) {
  const backToMap = () => {
    navigation.dispatch(goTo("MapGeolocation"));
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Nous vous remercions d'avoir choisi notre compagnie, nous vous
          contacterons dans quelques minutes sur votre téléphone
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
    margin: 20,
    marginTop: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 60,
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

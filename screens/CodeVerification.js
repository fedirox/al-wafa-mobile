import React, { useState } from "react";
import { API_URL } from "react-native-dotenv";

import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";

import * as apiUser from "../lib/apiUser";
export default function SendNumber({ navigation }) {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const phone = navigation.getParam("phone");

  const save = async (token) => {
    try {
      await AsyncStorage.setItem("TOKEN", token);
    } catch (err) {
      console.log(err);
    }
  };
  const resendNumber = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      await apiUser.sendNumber({ phoneNumber: phone });
    } catch (error) {
      setErrorMessage(
        "Il y a un probleme avec le serveur veuillez resseiller plus tard"
      );
    }
    setLoading(false);
  };

  const sendCode = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await apiUser.verifyCode({
        mobile_number: phone,
        verificationCode: code,
      });
      if (data.new) {
        navigation.navigate("CreateProfile", { phone: phone });
      } else {
        save(data.token);
        navigation.navigate("MapGeolocation");
      }
    } catch (error) {
      setErrorMessage("Le code que vous avez entré est invalide");
    }
    setLoading(false);
  };
  if (loading) {
    return (
      <View style={styles.body}>
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#f26522" />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/logo.png")}
        ></Image>
        <Text style={styles.desiption}>
          Un OTP a été envoyé, veuillez saisir le code reçu sur le numéro{" "}
          {phone}
        </Text>
        <TextInput
          placeholder="Votre Code"
          style={styles.numberInput}
          value={code}
          onChangeText={setCode}
          maxLength={6}
          keyboardType="numeric"
        ></TextInput>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.submitButtonWrapper}>
          <Text onPress={() => sendCode()} style={styles.submitButton}>
            Envoyer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButtonWrapper}>
          <Text onPress={() => resendNumber()} style={styles.submitButton}>
            Renvoyer Un SMS
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
    margin: "5%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingRight: 50,
    paddingLeft: 50,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: "center",
  },
  desiption: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  numberInput: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
    borderColor: "#f26522",
    borderWidth: 0,
    borderBottomWidth: 2,
    marginRight: 10,
    padding: 10,
  },
  errorText: {
    textAlign: "left",
    color: "red",
    fontSize: 12,
  },
  submitButtonWrapper: {
    marginTop: 20,
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
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

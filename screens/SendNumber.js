import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { TouchableOpacity } from "react-native-gesture-handler";
import { API_URL } from "react-native-dotenv";

export default function SendNumber({ navigation }) {
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const code = "(+216)";

  const sendNumber = async () => {
    if (number.match(/^[0-9]{8}$/g)) {
      setErrorMessage("");
      setLoading(true);
      let url = `${API_URL}/users/number`;
      let phoneNumber = code + number;

      await axios
        .post(url, {
          mobile_number: phoneNumber,
        })
        .then((response) => {
          console.log(response);

          navigation.navigate("CodeVerification", {
            phone: phoneNumber,
          });
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage(
            "Il y a un probleme avec le serveur veuillez resseiller plus tard"
          );
        });

      setTimeout(function () {
        setLoading(false);
      }, 500);
    } else {
      setErrorMessage("Le numéro n'est pas valide");
    }
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
        <View style={styles.head}>
          <Image
            style={styles.logo}
            source={require("../assets/logo.png")}
          ></Image>
          <Text style={styles.title}>À VOTRE SERVICE</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.descrption}>
            Veuillez saisir votre numéro de téléphone
          </Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.codeInput}
              value={code}
              editable={false}
            ></TextInput>
            <TextInput
              placeholder="Votre numéro"
              style={styles.numberInput}
              value={number}
              onChangeText={setNumber}
              maxLength={8}
              keyboardType="numeric"
            ></TextInput>
          </View>
        </View>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.submitButtonWrapper}>
          <Text onPress={() => sendNumber()} style={styles.submitButton}>
            Envoyer
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
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    marginTop: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  content: {
    textAlign: "left",
  },
  head: {
    alignItems: "center",
    borderRadius: 10,
  },
  descrption: {
    textAlign: "left",
  },
  codeInput: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    borderColor: "#f26522",
    borderWidth: 0,
    borderBottomWidth: 2,
    marginRight: 10,
    padding: 10,
  },
  numberInput: {
    width: "55%",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    borderColor: "#f26522",
    borderWidth: 0,
    borderBottomWidth: 2,
    marginRight: 10,
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  title: {
    marginTop: 50,
    marginBottom: 50,
    fontWeight: "bold",
    fontSize: 30,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  errorText: {
    textAlign: "left",
    padding: 10,
    width: "80%",
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

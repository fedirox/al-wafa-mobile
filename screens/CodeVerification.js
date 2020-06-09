import React, { Component, useState } from "react";
import { View, StyleSheet, Text, Button, TextInput } from "react-native";
import axios from "axios";

export default function SendNumber({ route, navigation }) {
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const { phone } = route.params;
  const checkNumber = () => {
    let url = "http://192.168.43.53:3000/users/verify-code";
    axios
      .post(url, {
        mobile_number: phone,
        verificationCode: code,
      })
      .then((response) => {
        console.log(response);
        navigation.navigate("CreateProfile", { phone: phone });
      })
      .catch((error) => {
        setErrorMessage("Try to put a valid code!");
      });
  };
  return (
    <View style={styles.container}>
      {errorMessage && <Text style={{ color: "#fff" }}>{errorMessage}</Text>}
      <TextInput
        style={styles.codeInput}
        keyboardType={"numeric"}
        maxLength={6}
        onChangeText={(text) => {
          setCode(text);
          setErrorMessage(null);
        }}
      />
      <Button
        title="Learn More"
        color="#841584"
        disabled={!code.match(/^[0-9]{6}$/g)}
        accessibilityLabel="Learn more about this purple button"
        onPress={() => checkNumber()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "10%",
    paddingRight: "10%",
  },
  codeInput: {
    backgroundColor: "#fff",
    width: "60%",
    paddingLeft: 25,
    fontSize: 40,
    borderRadius: 20,
    marginBottom: 20,
  },
});

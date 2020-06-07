import React, { Component, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
export default function CreateProfile({ route, navigation }) {

  const { phone } = route.params;

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const checkNumber = () => {
    let url = "http://192.168.1.6:3000/users/add/one";

    let err = 0;
    let nameCheker = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    let emailCheker = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!firstName.match(nameCheker)) {
      err++;
    }
    if (!lastName.match(nameCheker)) {
      err++;
    }
    if (!email.match(emailCheker)) {
      err++;
    }
    if (err === 0) {
      axios
        .post(url, {
          first_name: firstName,
          last_name: lastName,
          date_birth: date,
          email: email,
          mobile_number: phone
          })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={phone}
        editable={false}
      ></TextInput>
      <View style={styles.datePickerWrapper} onTouchStart={showDatepicker}>
        <FontAwesomeIcon size={30} icon={faCalendar} />
        <TextInput
          style={styles.codeInput}
          showSoftInputOnFocus={false}
          caretHidden={true}
          value={moment(date).format("DD/MM/YYYY")}
        ></TextInput>
      </View>
      <TouchableOpacity
        style={styles.submitButtonWrapper}
        onPress={checkNumber}
      >
        <Text style={styles.submitButton}>Button</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
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
  input: {
    backgroundColor: "#fff",
    width: "100%",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  codeInput: {
    fontSize: 20,
    marginLeft: 10,
  },
  datePickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    width: "100%",
  },
  submitButtonWrapper: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  submitButton: {
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "red",
    padding: 10,
    width: "100%",
    color: "#fff",
    fontSize: 20,
  },
});

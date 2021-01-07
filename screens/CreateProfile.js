import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "react-native-dotenv";
import { goTo } from "../helpers/CostumNavigation";
export default function CreateProfile({ navigation }) {
  const phone = navigation.getParam("phone");

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const save = async (token) => {
    try {
      await AsyncStorage.setItem("TOKEN", token);
    } catch (err) {
      console.log(err);
    }
  };
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

  const validateForm = () => {
    let nameCheker = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    let emailCheker = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!firstName.match(nameCheker)) {
      setErrorMessage("Le prenom n'est pas valide");
    } else if (!lastName.match(nameCheker)) {
      setErrorMessage("Le nom n'est pas valide");
    } else if (!email.match(emailCheker)) {
      setErrorMessage("L'email n'est pas valide");
    } else {
      setErrorMessage("");
    }
  };

  const checkNumber = async () => {
    const url = `${API_URL}/users/add`;
    validateForm();
    if (!errorMessage) {
      await axios
        .post(url, {
          first_name: firstName,
          last_name: lastName,
          date_birth: date,
          email: email,
          mobile_number: phone,
        })
        .then((response) => {
          save(response.data.token);
          navigation.navigate("MapGeolocation");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <View style={styles.body}>
      <View style={styles.container}>
        <Text style={styles.title}> Creation de compte</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          placeholder="Prenom"
          onChangeText={(text) => setFirstName(text)}
        ></TextInput>
        <TextInput
          style={styles.input}
          value={lastName}
          placeholder="Nom"
          onChangeText={(text) => setLastName(text)}
        ></TextInput>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          style={styles.input}
          value={phone}
          editable={false}
        ></TextInput>
        <Text style={styles.label}>Date de naissance</Text>
        <View style={styles.datePickerWrapper} onTouchStart={showDatepicker}>
          <FontAwesomeIcon size={30} icon={faCalendar} />
          <TextInput
            style={styles.codeInput}
            showSoftInputOnFocus={false}
            caretHidden={true}
            value={moment(date).format("DD/MM/YYYY")}
          ></TextInput>
        </View>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity
          style={styles.submitButtonWrapper}
          onPress={() => checkNumber()}
        >
          <Text style={styles.submitButton}>S'inscrire</Text>
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
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    marginTop: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 50,
  },
  title: {
    margin: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    fontSize: 14,
    marginTop: 10,
    color: "#000",
    borderColor: "#f26522",
    marginBottom: 10,
    borderBottomWidth: 2,
    padding: 2,
  },
  codeInput: {
    fontSize: 14,
    marginLeft: 10,
  },
  label: {
    textAlign: "left",
    padding: 10,
    width: "80%",
    fontSize: 14,
  },
  datePickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderColor: "#f26522",
    width: "100%",
  },
  submitButtonWrapper: {
    marginTop: 20,
    borderRadius: 10,
    width: "100%",
  },
  submitButton: {
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#f26522",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    fontSize: 16,
  },
});

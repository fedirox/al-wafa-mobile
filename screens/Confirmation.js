import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
} from "react-native";
import { getDistance, getPreciseDistance } from "geolib";
import { API_URL } from "react-native-dotenv";
import axios from "axios";
import { goTo } from "../helpers/CostumNavigation";

export default function Confirmation({ navigation }) {
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const travel = navigation.getParam("travel");

  const loadNumber = async () => {
    setLoading(true);
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
          .then((response) => {
            setLoading(false);
            setPhone(response.data.phone);
          })
          .catch((error) => {
            navigation.dispatch(goTo("SendNumber"));
          });
      } else {
        navigation.dispatch(goTo("SendNumber"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadNumber();
    const distance = getPreciseDistance(
      travel.from.location,
      travel.to.location
    );
    const distanceKm = distance / 1000;
    const distanceFinale = distanceKm + distanceKm * 0.4;
    setPrice(
      distanceFinale < 5 ? "5DT" : Math.round(distanceFinale + 0.4) + "DT"
    );
  }, []);

  const confirmerRequete = async () => {
    try {
      let token = await AsyncStorage.getItem("TOKEN");

      if (!token) {
        navigation.dispatch(goTo("SendNumber"));
      }
      const url = `${API_URL}/reservations/add`;
      await axios
        .post(
          url,
          {
            price: price,
            travel: travel,
          },
          {
            headers: { "x-auth-token": token },
          }
        )
        .then(() => {
          navigation.dispatch(goTo("Remerciment"));
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
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
        <Text style={styles.title}>Votre resevation :</Text>
        <View style={styles.line}>
          <Text style={styles.label}>Votre numero :</Text>
          <Text style={styles.data}>{phone}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.label}>Point de depart :</Text>
          <Text style={styles.data}>{travel.from.street}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.label}>Destination :</Text>
          <Text style={styles.data}>{travel.to.street}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.label}>Prix :</Text>
          <Text style={styles.data}>{price}</Text>
        </View>
        <TouchableOpacity style={styles.submitButtonWrapper}>
          <Text onPress={() => confirmerRequete()} style={styles.submitButton}>
            Confirmer la reservation
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 60,
  },
  line: {
    marginTop: 10,
    flexDirection: "row",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f26522",
    marginBottom: 20,
    width: "40%",
  },
  data: {
    marginLeft: 20,
    width: "50%",
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

import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SendNumber from "./screens/SendNumber";
import CodeVerification from "./screens/CodeVerification";
import CreateProfile from "./screens/CreateProfile";
import MapGeolacation from "./screens/MapGeolacation";
const Stack = createStackNavigator();
export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SendMessage"
            component={SendNumber}
            options={{ title: "Welcome" }}
          />
          <Stack.Screen
            name="CodeVerification"
            component={CodeVerification}
            options={{ title: "verify your code" }}
          />
          <Stack.Screen
            name="CreateProfile"
            component={CreateProfile}
            options={{ title: "Create Account" }}
          />
          <Stack.Screen
            name="MapGeolacation"
            component={MapGeolacation}
            options={{ title: "Geolacation" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A1EDBF",
  },
});

import React, { Component, useState } from "react";
import { View, StyleSheet } from "react-native";
import MyMap from "../components/MyMap";
export default function CreateProfile({ route, navigation }) {
  return (
    <View style={styles.container}>
      <MyMap style={styles.map}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
      },
      map: {
        width: '100%',
        height: '100%'
      },
});

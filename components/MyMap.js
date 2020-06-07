import React, { Component, useState } from "react";
import { View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
export default class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        region: {}
    };
    this.onRegionChange = this.onRegionChange.bind(this);
  }
  getInitialState() {
    return {
    };
  }
  onRegionChange(region) {
    this.setState({ region });
  }
  render() {
    return (
      <View style={styles.container}>
        <MapView
        style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

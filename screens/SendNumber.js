import React, { Component } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import IntlPhoneInput from "react-native-intl-phone-input";
import axios from "axios"; 

export default class SendNumber extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      dialCode: null,
      unmaskedPhoneNumber: null,
      phoneNumber: null,
      isVerified: null,
      errorMessage: null,
    };

    this.checkNumber = this.checkNumber.bind(this);
  }

  onChangeText = ({
    dialCode,
    unmaskedPhoneNumber,
    phoneNumber,
    isVerified,
  }) => {
    console.log(dialCode, unmaskedPhoneNumber, phoneNumber, isVerified);
    this.setState({
      dialCode,
      unmaskedPhoneNumber,
      phoneNumber,
      isVerified,
      errorMessage: null,
    });
  };
  checkNumber() {
    if (this.state.dialCode !== "+216") {
      this.setState({
        errorMessage: "Ce pays n'est pas pris en charge",
      });
    } else {
      console.log(this.state);
      let url = "http://192.168.1.6:3000/users/send-code";
      let phoneNumber = this.state.dialCode + this.state.unmaskedPhoneNumber
      // axios.post(url, {
      //   mobile_number: phoneNumber,
      //   verificationMethod: "sms",
      // })
      //   .then((response) => {
      //     console.log(response); 
          this.props.navigation.navigate('CodeVerification', { phone: phoneNumber })
        // })
        // .catch((error) => {
        //   console.log(error);
        // });
    }
  }
  render() {
    const { errorMessage, isVerified } = this.state;
    const disabled = !isVerified ? true : false;
    return (
      <View style={styles.container}>
        {errorMessage && <Text style={{ color: "#fff" }}>{errorMessage}</Text>}
        <IntlPhoneInput
          style={styles.phoneInput}
          onChangeText={this.onChangeText}
          defaultCountry="TN"
        />
        <Button
          onPress={this.checkNumber}
          title="Learn More"
          color="#841584"
          disabled={disabled}
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "10%",
    paddingRight: "10%",
    color: "#fff",
  },
  phoneInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "40%",
  },
});

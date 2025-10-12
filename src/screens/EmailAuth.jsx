import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const EmailAuth = () => {
  return (
    <View style={styles.container}>
      <Text>Authentificate with your email</Text>
      <TextInput />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default EmailAuth;

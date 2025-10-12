import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EmailAuth = () => {
  return (
    <View style={styles.container}>
      <Text>Authentificate with your email</Text>
      <TextInput />
      <TouchableOpacity>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Go back</Text>
      </TouchableOpacity>
      <Text>Haven't got an account sign up</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default EmailAuth;

import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

const TextScreen = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View>
      <Text>Enter Name:</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(value) => setName(value)}
      />
      <Text>My name's {name}</Text>
      <Text>Enter Password:</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(value) => setPassword(value)}
      />
      <Text>Password must be longer than 5</Text>
      {password.length > 5 ? <Text>That was true</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    margin: 10,
    padding: 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default TextScreen;

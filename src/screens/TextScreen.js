import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

const TextScreen = () => {
  const [name, setName] = useState("");

  return (
    <View>
      <Text>Enter your name:</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(value) => setName(value)}
      />
      <Text>My name's {name}</Text>
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

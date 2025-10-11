import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";

const Prompt = ({ onSubmit, input, setInput }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        autoCorrect={false}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.text,
            backgroundColor: colors.primary,
          },
        ]}
        placeholder="Ask anything you want..."
        placeholderTextColor={colors.text}
        autoCapitalize="none"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={() => onSubmit(input)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderRadius: 27.5,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Prompt;

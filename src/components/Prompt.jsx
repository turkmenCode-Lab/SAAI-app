import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useLangStore } from "../../store/langStore";

const Prompt = ({ onSubmit, input, setInput }) => {
  const { colors } = useTheme();
  const { t } = useLangStore();

  return (
    <View style={styles.container}>
      <TextInput
        autoCorrect={false}
        style={[
          styles.input,
          {
            color: colors.text,
            borderColor: colors.text,
          },
        ]}
        placeholder={t("askAnything")}
        placeholderTextColor={colors.text}
        autoCapitalize="none"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={() => onSubmit(input)}
        multiline
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
  },
});

export default Prompt;

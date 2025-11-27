import React from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useTranslations } from "../utils/translations";
import { useAppTheme } from "../theme";
import Feather from "@expo/vector-icons/Feather";

const Prompt = ({ onSubmit, input, setInput, isLoading }) => {
  const { colors } = useAppTheme();
  const t = useTranslations();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: colors.primary,
            backgroundColor: colors.background,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
        ]}
      >
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Feather name="paperclip" size={20} color={colors.solarized_light} />
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          indicatorStyle={colors.neutral}
          persistentScrollbar={true}
        >
          <TextInput
            autoCorrect={false}
            style={[styles.input, { color: colors.text }]}
            placeholder={t("howHelp") || "Ask anything"}
            placeholderTextColor={colors.text + "60"}
            autoCapitalize="sentences"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => onSubmit(input)}
            multiline
            maxLength={2000}
            scrollEnabled={false}
          />
        </ScrollView>

        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Feather name="mic" size={20} color={colors.text + "90"} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.submit, { backgroundColor: colors.accent }]}
          onPress={() => onSubmit(input)}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <ActivityIndicator
              style={{ alignSelf: "center" }}
              size="small"
              color={colors.background}
            />
          ) : (
            <Feather
              name="arrow-up"
              style={{ alignSelf: "center" }}
              size={22}
              color="#f5f5f5ff"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 28,
    paddingHorizontal: 4,
    paddingVertical: 4,
    minHeight: 56,
    borderWidth: 1.15,
    borderTopWidth: 2.15,
  },
  scrollContainer: {
    flex: 1,
    maxHeight: 120,
  },
  iconButton: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 44,
  },
  submit: {
    borderRadius: 26,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
});

export default Prompt;

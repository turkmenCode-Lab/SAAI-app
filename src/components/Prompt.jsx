import React from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { useTranslations } from "../utils/translations";
import { useAppTheme } from "../theme";
import Feather from "@expo/vector-icons/Feather";

const Prompt = ({ onSubmit, input, setInput, isLoading }) => {
  const { colors } = useAppTheme();
  const t = useTranslations();

  const isDark = colors.background === "#000000";

  const PromptContent = () => (
    <View style={styles.contentWrapper}>
      <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
        <Feather name="paperclip" size={20} color={colors.text + "CC"} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        persistentScrollbar={true}
      >
        <TextInput
          autoCorrect={false}
          style={[styles.input, { color: colors.text }]}
          placeholder={t("howHelp") || "Ask anything"}
          placeholderTextColor={colors.text + "50"}
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
        <Feather name="mic" size={20} color={colors.text + "CC"} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.submit,
          { backgroundColor: colors.accent },
          styles.submitShadow,
        ]}
        onPress={() => onSubmit(input)}
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? (
          <ActivityIndicator
            style={{ alignSelf: "center" }}
            size="small"
            color="#FFFFFF"
          />
        ) : (
          <Feather
            name="arrow-up"
            style={{ alignSelf: "center" }}
            size={22}
            color="#FFFFFF"
          />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={80}
          tint={isDark ? "dark" : "light"}
          style={[
            styles.inputWrapper,
            {
              borderColor: colors.text + "20",
            },
          ]}
          experimentalBlurMethod="dimezisBlurView"
        >
          <PromptContent />
        </BlurView>
      ) : (
        <View
          style={[
            styles.inputWrapper,
            styles.androidGlass,
            {
              backgroundColor: colors.background + "CC",
              borderColor: colors.text + "20",
            },
          ]}
        >
          <PromptContent />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 15,
    right: 15,
    zIndex: 1000,
  },
  inputWrapper: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    minHeight: 56,
    borderRadius: 28,
    borderWidth: 1,
    overflow: "hidden",
  },
  androidGlass: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
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
    outlineWidth: 0,
  },
  submit: {
    borderRadius: 24,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  submitShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default Prompt;

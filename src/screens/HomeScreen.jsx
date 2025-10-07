import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import PropTypes from "prop-types";
import { Toast } from "toastify-react-native";
import Prompt from "../components/Prompt";
import Header from "../components/Header";
import { AppTheme } from "../theme";

const HomeScreen = ({ navigation }) => {
    const [input, setInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (text) => {
        if (!text.trim()) {
            Toast.error("Please enter some text before submitting.", {
                duration: 3000,
                position: "bottom",
                style: {
                    backgroundColor: AppTheme.colors.background,
                    borderRadius: 16,
                    padding: 12,
                    marginHorizontal: 16,
                    borderWidth: 1,
                    borderColor: AppTheme.colors.vitally,
                    shadowColor: AppTheme.colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                },
                textStyle: {
                    color: AppTheme.colors.text,
                    fontWeight: "500",
                    fontSize: 14,
                    textAlign: "center",
                },
            });
            return;
        }

        setIsSubmitting(true);
        try {
            console.log("Submitted:", text);
            setInput("");

            Toast.success("Submission successful! 🎉", {
                duration: 2000,
                position: "bottom",
                style: {
                    backgroundColor: AppTheme.colors.background,
                    borderRadius: 16,
                    padding: 12,
                    marginHorizontal: 16,
                    borderWidth: 1,
                    borderColor: AppTheme.colors.principally,
                    shadowColor: AppTheme.colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                },
                textStyle: {
                    color: AppTheme.colors.text,
                    fontWeight: "500",
                    fontSize: 14,
                    textAlign: "center",
                },
            });

        } catch (error) {
            Toast.error("Submission failed. Please try again.", {
                duration: 3000,
                position: "bottom",
                style: {
                    backgroundColor: AppTheme.colors.background,
                    borderRadius: 16,
                    padding: 12,
                    marginHorizontal: 16,
                    borderWidth: 1,
                    borderColor: AppTheme.colors.vitally,
                    shadowColor: AppTheme.colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                },
                textStyle: {
                    color: AppTheme.colors.text,
                    fontWeight: "500",
                    fontSize: 14,
                    textAlign: "center",
                },
            });
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsSubmitting(false);
        console.log("Submission cancelled");
        Toast.info("Submission cancelled.", {
            duration: 2000,
            position: "bottom",
            style: {
                backgroundColor: AppTheme.colors.background,
                borderRadius: 16,
                padding: 12,
                marginHorizontal: 16,
                borderWidth: 1,
                borderColor: AppTheme.colors.secondary,
                shadowColor: AppTheme.colors.text,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
            },
            textStyle: {
                color: AppTheme.colors.text,
                fontWeight: "500",
                fontSize: 14,
                textAlign: "center",
            },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={styles.main}>
                <Text style={styles.greeting} accessibilityLabel="Greeting message">
                    How can I help you today?
                </Text>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoiding}
            >
                <View style={styles.content}>
                    <Prompt onSubmit={handleSubmit} input={input} setInput={setInput} />
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.submit}
                        onPress={() => (isSubmitting ? handleCancel() : handleSubmit(input))}
                        accessibilityLabel={isSubmitting ? "Cancel submission" : "Submit input"}
                        accessibilityRole="button"
                    >
                        {isSubmitting ? (
                            <FontAwesome6 name="stop" size={24} color="black" />
                        ) : (
                            <Feather name="arrow-up" size={28} color="black" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

HomeScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme?.colors?.background || "#fff",
    },
    keyboardAvoiding: {
        flex: 1,
        justifyContent: "flex-end",
    },
    content: {
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    submit: {
        backgroundColor: AppTheme?.colors?.text || "#000",
        borderRadius: 22.5,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        width: 52,
        height: 52,
    },
    greeting: {
        alignSelf: "center",
        fontSize: 24,
        fontWeight: "600",
        color: AppTheme?.colors?.text || "#000",
    },
    main: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default HomeScreen;
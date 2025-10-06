import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import Prompt from "../components/Prompt";
import Header from "../components/Header";
import { AppTheme } from "../theme";

const HomeScreen = ({ navigation }) => {
    const [input, setInput] = useState("");

    const handleSubmit = (text) => {
        console.log("Submitted:", text);
        setInput("");
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoiding}
            >
                <View style={styles.content}>
                    <Prompt onSubmit={handleSubmit} input={input} setInput={setInput} />
                    <TouchableOpacity
                        style={styles.submit}
                        onPress={() => handleSubmit(input)}
                    >
                        <Feather name="arrow-up" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.colors.background,
    },
    keyboardAvoiding: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    content: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submit: {
        backgroundColor: AppTheme.colors.text,
        borderRadius: 22.5,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
    },
});

export default HomeScreen;
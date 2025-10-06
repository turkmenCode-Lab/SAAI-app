import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
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
            <View style={styles.content}>
                <Prompt onSubmit={handleSubmit} input={input} setInput={setInput} />
                <TouchableOpacity
                    style={styles.submit}
                    onPress={() => handleSubmit(input)}
                >
                    <Feather name="arrow-up" size={24} color={AppTheme.colors.text} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.colors.background,
    },
    content: {
        flex: 1,
        padding: 15,
        justifyContent: "space-between",
    },
    submit: {
        backgroundColor: AppTheme.colors.primary,
        borderRadius: 22.5,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        width: 60,
        height: 60,
    },
});

export default HomeScreen;
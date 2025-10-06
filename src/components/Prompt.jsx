import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { AppTheme } from "../theme";

const Prompt = ({ onSubmit, input, setInput }) => {
    return (
        <View style={styles.container}>
            <TextInput
                autoCorrect={false}
                style={styles.input}
                placeholder="Ask anything you want..."
                placeholderTextColor={AppTheme.colors.primary}
                autoCapitalize="none"
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => onSubmit(input)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    input: {
        marginHorizontal: 15,
        color: AppTheme.colors.text,
        borderRadius: 22.5,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        borderColor: AppTheme.colors.primary,
        borderWidth: 2,
        backgroundColor: "#1a1a1a",
    },
});

export default Prompt;
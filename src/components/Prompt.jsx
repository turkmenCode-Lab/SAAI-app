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
    container: {
        flex: 1,
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: AppTheme.colors.text,
        borderRadius: 27.5,
        paddingVertical: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        borderColor: AppTheme.colors.primary,
        borderWidth: 2,
        backgroundColor: "#1a1a1a",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
});

export default Prompt;
import React from "react"
import {TextInput, View, StyleSheet} from "react-native";

const Prompt = () => {
    return (
        <View style={styles.container}>
            <TextInput
                autoCorrect={false}
                style={styles.input}
                placeholder="Ask anything you want..."
                placeholderTextColor="grey"
                autoCapitalize="none"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        marginHorizontal: 15,
        color: '#fff',
        borderRadius: 22.5,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        borderColor: '#c5c5c5',
        borderWidth: 2,
    },
})

export default Prompt;
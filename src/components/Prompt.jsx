import React from "react"
import {TextInput, View, StyleSheet} from "react-native";

const Prompt = () => {
    return (
        <View style={styles.container}>
        <TextInput/>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default Prompt;
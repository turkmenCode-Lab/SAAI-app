import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppTheme } from "../theme";

const Header = () => {
    return (
        <View style={styles.header}>
            <FontAwesome6 name="book-open" size={24} color={AppTheme.colors.text} />
            <Text>Asisstant</Text>
            <TouchableOpacity>
                <MaterialCommunityIcons name="star-four-points-outline" size={24} color="black" />
                <Text>Get Pro</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 2,
        borderBottomColor: AppTheme.colors.primary,
        padding: 15,
        alignItems: "center",
    },
});

export default Header;
import React from "react";
import { View, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { AppTheme } from "../theme";

const Header = () => {
    return (
        <View style={styles.header}>
            <FontAwesome6 name="book-open" size={24} color={AppTheme.colors.text} />
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
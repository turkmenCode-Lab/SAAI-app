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
            <TouchableOpacity style={styles.getPro}>
                <MaterialCommunityIcons name="star-four-points-outline" size={24} color="white" />
                <Text style={{ color: AppTheme.colors.vitally, fontSize: 14, fontWeight: 800}}>Get Pro</Text>
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
    getPro: {
        display: "flex",
        flexDirection: "row",
        gap: 3,
        backgroundColor: AppTheme.colors.secondary,
        borderRadius: 22.5,
        paddingVertical: 7.5,
        paddingHorizontal: 12.5,
        alignItems: 'center',
        justifyContent: 'center',

    }
});

export default Header;
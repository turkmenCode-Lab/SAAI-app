import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppTheme } from "../theme";

const Header = () => {
    return (
        <View style={styles.header}>
            {/* Left Icon */}
            <FontAwesome6 name="book-open" size={28} color={AppTheme.colors.text} />

            {/* Title */}
            <Text style={styles.heading}>Assistant</Text>

            {/* Get Pro Button */}
            <TouchableOpacity style={styles.getPro}>
                <MaterialCommunityIcons
                    name="star-four-points-outline"
                    size={20}
                    color={AppTheme.colors.vitally}
                />
                <Text style={styles.getProText}>Get Pro</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: AppTheme.colors.primary,
        backgroundColor: AppTheme.colors.background,
    },
    heading: {
        fontSize: 20,
        fontWeight: "600",
        color: AppTheme.colors.text,
        letterSpacing: 0.5,
    },
    getPro: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: AppTheme.colors.secondary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    getProText: {
        color: AppTheme.colors.vitally,
        fontWeight: "600",
        fontSize: 14,
        marginLeft: 6,
    },
});


export default Header;

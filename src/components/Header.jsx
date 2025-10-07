import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AppTheme } from "../theme";

const Header = () => {
    return (
        <View style={styles.header}>
            <View style={styles.leftSection}>
                <FontAwesome6 name="book-open" size={28} color={AppTheme.colors.text} />
                <Text style={styles.heading}>Asisstant</Text>
            </View>

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
        marginHorizontal: 5,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: AppTheme.colors.background,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    heading: {
        fontSize: 18,
        fontWeight: "600",
        color: AppTheme.colors.text,
        letterSpacing: 0.5,
        marginLeft: 8
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
import React from "react"
import {View, Text, StyleSheet} from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { AppTheme } from "../../theme"

const Header = () => {
    return (<View style={[styles.Header]}>
        <FontAwesome6 name="book-open" size={24} color={AppTheme.colors.text} />
    </View>)
}

const styles = StyleSheet.create({
    Header: {
        borderBottomWidth: 2,
        borderBottomColor: AppTheme.colors.primary,
    }
})

export default Header;
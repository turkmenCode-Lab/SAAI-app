import React from "react"
import {View, Text, StyleSheet} from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const Header = () => {
    return (<View style={[styles.Header]}>
        <FontAwesome6 name="book-open" size={24} color="#FF6B00" />
    </View>)
}

const styles = StyleSheet.create({
    Header: {

    }
})

export default Header;
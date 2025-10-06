import React from "react";
import {Text, StyleSheet, View, TouchableOpacity} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Prompt from "../components/Prompt";
import Header from "../components/Header";

import Feather from '@expo/vector-icons/Feather';

const HomeScreen = ({ navigation }) => {
  return (
      <SafeAreaView style={{ flex: 1 }}>
          <Header />
          <View>
            <Prompt/>
            <TouchableOpacity style={styles.sumbit} onPress={() => navigation.goBack()}><Feather name="arrow-up" size={24} color="black" /></TouchableOpacity>
          </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
    sumbit: {
      backgroundColor: "white",
    }
});

export default HomeScreen;

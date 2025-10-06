import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Prompt from "../components/Prompt";

const HomeScreen = ({ navigation }) => {
  return (
      <SafeAreaView style={{ flex: 1 }}>
            <Prompt/>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
});

export default HomeScreen;

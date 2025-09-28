import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BoxScreen = () => {
  return (
    <View style={styles.parentStyle}>
      <View style={styles.viewOneStyle} />
      <View style={styles.viewTwoStyle} />
      <View style={styles.viewThreeStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  parentStyle: {
    borderWidth: 3,
    borderColor: "black",
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  viewOneStyle: { width: 50, height: 50, backgroundColor: "red" },
  viewTwoStyle: {
    width: 50,
    height: 50,
    backgroundColor: "green",
    alignSelf: "flex-end",
  },
  viewThreeStyle: { width: 50, height: 50, backgroundColor: "blue" },
});

export default BoxScreen;

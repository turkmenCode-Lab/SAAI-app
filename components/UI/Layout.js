import React from "react";
import { View, StyleSheet } from "react-native";
import NavBar from "./NavBar";
import BottomBar from "./BottomBar";

export default function Layout({ navigation, title, children }) {
  return (
    <View style={styles.container}>
      <NavBar navigation={navigation} title={title} />
      <View style={styles.content}>{children}</View>
      <BottomBar navigation={navigation} activeRoute="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});

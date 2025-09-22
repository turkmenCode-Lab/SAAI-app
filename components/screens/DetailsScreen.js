import React from "react";
import { View, Text, StyleSheet } from "react-native";
import NavBar from "../UI/NavBar";
import BottomBar from "../UI/BottomBar";

export default function DetailsScreen({ navigation, setActiveRoute }) {
  React.useEffect(() => setActiveRoute("Details"), []);

  return (
    <View style={styles.container}>
      <NavBar navigation={navigation} title="Details" />
      <View style={styles.content}>
        <Text style={styles.text}>Details Screen Content</Text>
      </View>
      <BottomBar navigation={navigation} activeRoute="Details" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
});

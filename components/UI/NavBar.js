import * as React from "react";
import { Appbar } from "react-native-paper";

export default function NavBar({ navigation, title }) {
  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      <Appbar.Action icon="home" onPress={() => navigation.navigate("Home")} />
      <Appbar.Action
        icon="information"
        onPress={() => navigation.navigate("Details")}
      />
    </Appbar.Header>
  );
}

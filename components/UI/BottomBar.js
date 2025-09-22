import * as React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { BlurView } from "expo-blur";

export default function BottomBar({ navigation, activeRoute }) {
  const tabs = [
    { name: "Home", icon: "home" },
    { name: "Details", icon: "information" },
  ];

  return (
    <BlurView intensity={50} tint="light" style={styles.blurContainer}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = activeRoute === tab.name;
          return (
            <View key={tab.name} style={styles.item}>
              <Appbar.Action
                icon={tab.icon}
                color={isActive ? "#007aff" : "#8e8e93"}
                size={28}
                onPress={() => navigation.navigate(tab.name)}
              />
              <Text
                style={[
                  styles.label,
                  { color: isActive ? "#007aff" : "#8e8e93" },
                ]}
              >
                {tab.name}
              </Text>
            </View>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: Platform.OS === "ios" ? 20 : 12,
    backgroundColor: "transparent",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    marginTop: 2,
  },
});

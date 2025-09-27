import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ColorCounter from "../components/ColorCounter";

const COLOR_INCREMENT = 15;

const SquareScreen = () => {
  return (
    <View>
      <ColorCounter
        onIncrease={() => setColor("red", COLOR_INCREMENT)}
        onDecrease={() => setColor("red", -COLOR_INCREMENT)}
        color="Red"
      />
      <ColorCounter
        onIncrease={() => setColor("green", COLOR_INCREMENT)}
        onDecrease={() => setColor("green", -COLOR_INCREMENT)}
        color="Green"
      />
      <ColorCounter
        onIncrease={() => setColor("blue", COLOR_INCREMENT)}
        onDecrease={() => setColor("blue", -COLOR_INCREMENT)}
        color="Blue"
      />
      <View
        style={{
          height: 150,
          width: 150,
          backgroundColor: `rgb(${red}, ${green}, ${blue})`,
        }}
      />
    </View>
  );
};

export default SquareScreen;

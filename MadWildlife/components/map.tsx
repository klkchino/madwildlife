// filepath: /Users/oscar/Documents/SP26/madwildlife/MadWildlife/components/map.tsx
import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";

export const Map = () => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
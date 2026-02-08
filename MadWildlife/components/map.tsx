// filepath: /Users/oscar/Documents/SP26/madwildlife/MadWildlife/components/map.tsx
import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { useEffect, useRef } from "react";
import * as Location from "expo-location";

export const Map = () => {
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        800
      );
    })();
  }, []);

  return (
    <MapView
      style={styles.map}
      ref={mapRef}
      initialRegion={{
        latitude: 43.084283,
        longitude: -89.428786,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
       provider={PROVIDER_GOOGLE}
       showsUserLocation
    />
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
import React from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE} from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import CustomCallout from "./CustomCallout";
import { MarkerWithMetadata } from "../assets/markers";
import { useMarkers } from "@/contexts/MarkersContext";

import { useRoute, RouteProp } from "@react-navigation/native";

type MapRouteParams = {
  Map: {
    newMarker?: MarkerWithMetadata;
  };
};


export const Map = () => {
  const mapRef = useRef<MapView | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [heading, setHeading] = useState(0);
  const [navigationMode, setNavigationMode] = useState(false);
  const [initialLocationSet, setInitialLocationSet] = useState(false);
  const route = useRoute<RouteProp<MapRouteParams, 'Map'>>();
  const { markers } = useMarkers();

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    let headingSubscription: Location.LocationSubscription | null = null;

    (async () => {
      // Request permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // Get initial location and update map
      let location = await Location.getCurrentPositionAsync({});
      const initialLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(initialLocation);
      
      // Animate to user's actual location on initial load
      mapRef.current?.animateCamera(
        {
          center: {
            latitude: initialLocation.latitude,
            longitude: initialLocation.longitude,
          },
          pitch: 0,
          heading: 0,
          altitude: 500, // More zoomed out for 2D view
        },
        { duration: 800 }
      );
      setInitialLocationSet(true);

      // Watch user's position
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setUserLocation(newLocation);
        }
      );

      // Watch device heading (compass)
      headingSubscription = await Location.watchHeadingAsync((headingData) => {
        setHeading(headingData.trueHeading);
      });
    })();

    // Cleanup subscriptions on unmount
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      if (headingSubscription) {
        headingSubscription.remove();
      }
    };
  }, []);

  // Update camera when location or heading changes (only in navigation mode)
  useEffect(() => {
    if (userLocation && navigationMode && initialLocationSet) {
      mapRef.current?.animateCamera(
        {
          center: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          pitch: 45,
          heading: heading,
          altitude: 100,
          zoom: 18
        },
        { duration: 1 } // Smooth but not too slow
      );
    }
  }, [userLocation, heading, navigationMode, initialLocationSet]);

  const toggleNavigationMode = () => {
    if (!navigationMode && userLocation) {
      // Entering navigation mode
      setNavigationMode(true);
      mapRef.current?.animateCamera(
        {
          center: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          pitch: 45,
          heading: heading,
          altitude: 100,
          zoom: 20
        },
        { duration: 800 }
      );
    } else {
      // Exiting navigation mode - reset to 2D view
      setNavigationMode(false);
      if (userLocation) {
        mapRef.current?.animateCamera(
          {
            center: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
            pitch: 0, 
            heading: 0, 
            altitude: 800,
            zoom: 16
          },
          { duration: 800 }
        );
      }
    }
  };

  const handleMapPress = () => {
    // Disable navigation mode when user interacts with map
    if (navigationMode) {
      setNavigationMode(false);
    }
  };

  const renderMarkers = () => {
    return markers.map((marker, index) => (
      <Marker
        key={index}
        coordinate={marker.coordinate}
      >
        <Image 
          source={{ uri: marker.imageUrl }} 
          style={{ width: 45, height: 45, borderRadius: 20 }}
        />
        <CustomCallout marker={marker} />
      </Marker>
   ));
   };
    

  return (
    <View style={styles.container}>
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
        showsMyLocationButton={false}
        pitchEnabled={true}
        rotateEnabled={true}
        onPanDrag={handleMapPress} 
      >

      {renderMarkers()}
      </MapView>


      {/* Custom Navigation Button */}
      <TouchableOpacity
        style={[
          styles.navigationButton,
          navigationMode && styles.navigationButtonActive,
        ]}
        onPress={toggleNavigationMode}
      >
        <Ionicons
          name={navigationMode ? "navigate" : "navigate-outline"}
          size={24}
          color={navigationMode ? "#4285F4" : "#666"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  navigationButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navigationButtonActive: {
    backgroundColor: "#E8F0FE",
  },
});
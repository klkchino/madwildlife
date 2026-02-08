import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Map } from "@/components/map";
import { Settings } from "@/components/settings";
import { Camera } from "@/components/camera";
import { Dex } from "@/components/Dex";
import AntDesign from '@expo/vector-icons/AntDesign';
import { MaterialIcons } from "@expo/vector-icons";
import MaterialIcons2 from '@expo/vector-icons/MaterialIcons';
import { COLORS } from "@/assets/Theme";


const Tab = createBottomTabNavigator();

export function Navigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.accentDark,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.primary,
          borderTopColor: COLORS.primaryDark,
          borderTopWidth: 1,
        },
        headerShown: false,
      }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        },
      }}
    >
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={Camera}
        options={{
          title: "Camera",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="camera" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Dex"
        component={Dex}
        options={{
          title: "Dex",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons2 name="catching-pokemon" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
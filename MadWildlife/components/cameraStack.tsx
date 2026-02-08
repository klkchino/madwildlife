import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Camera } from "@/components/camera";
import  FieldGuide  from "../app/fieldGuide";

const Stack = createNativeStackNavigator();

export function CameraStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CameraStackView" component={Camera} />
      <Stack.Screen name="FieldGuide" component={FieldGuide} />
    </Stack.Navigator>
  );
}


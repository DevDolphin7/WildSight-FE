import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SingleWildlife from "@/components/SingleWildlife";
import MapScreen from "@/components/MapScreen";

const Stack = createStackNavigator();

export default function MapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ title: "Sightings map" }}
      />
      <Stack.Screen
        name="SingleWildlife"
        component={SingleWildlife}
        options={{ title: "Sighting Details" }}
      />
    </Stack.Navigator>
  );
}

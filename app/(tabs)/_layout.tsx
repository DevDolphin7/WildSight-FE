import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const HomeIcon = require("../../assets/images/HomeIcon.png");
const MyWildlifeIcon = require("../../assets/images/MyWildlifeIcon.png");
const MapIcon = require("../../assets/images/MapIcon.png");
const AddSightingIcon = require("../../assets/images/AddSightingIcon.png");


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <Image source={HomeIcon} style={{ width: 28, height: 28 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "My Wildlife",
          tabBarIcon: () => (
            <Image source={MyWildlifeIcon} style={{ width: 28, height: 28 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: () => (
            <Image source={MapIcon} style={{ width: 21, height: 28 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Add Sighting",
          tabBarIcon: () => (
            <Image source={AddSightingIcon} style={{ width: 28, height: 22 }} />
          ),
        }}
      />
    </Tabs>
  );
}

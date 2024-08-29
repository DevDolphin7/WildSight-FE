import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function HealthAndSafetyText() {
  const safetyGuidelines = [
    {
      key: "2",
      title: "Leave Only Footsteps",
      content:
        "Enjoy nature responsibly by minimising your impact. While it's exciting to identify plant species, always consider whether it's worth the potential harm. If the plant could be damaged in the process, it’s better to admire it from a distance.",
    },
    {
      key: "1",
      title: "Foraging Warning",
      content:
        "This app is not intended for foraging. Many edible plants closely resemble toxic ones. The AI may not always accurately distinguish between species, as its learning is based on the images it has encountered. Always prioritise safety and do not rely on the app to determine whether a plant is safe to consume.",
    },
    {
      key: "3",
      title: "Leave No Trace Principles",
      content:
        "While in nature, we encourage you to follow the 'Leave No Trace' principles, which include disposing of waste properly, respecting wildlife, and being considerate of other visitors.",
    },
    {
      key: "4",
      title: "Stay Safe Near Waterways",
      content:
        "Never risk your safety for a photo. Water temperatures can be deceptively low, even on warm days, and depths can be hard to judge. Maintain a safe distance from water, cliff edges, and slopes leading to water.",
    },
    {
      key: "5",
      title: "Limit Physical Contact with Plants",
      content:
        "Many plants in the UK can be harmful, causing anything from skin irritation to more serious health risks. Avoid picking or touching plants to protect yourself and the environment.",
    },
    {
      key: "6",
      title: "Respect Wildlife",
      content:
        "Do not remove animals from their natural habitats, even temporarily. Transferring animals, even from one pond to another, can spread diseases that are harmful to wildlife.",
    },
    {
      key: "7",
      title: "Ticks",
      content:
        "Ticks are common in nature and carry many diseases, most notably Lyme disease. Make sure to wear clothes that cover the skin, and tuck pants into socks when walking in tall grass. Always check for ticks after spending time outdoors.",
    },
    {
      key: "8",
      title: "Stay on Marked Trails",
      content:
        "Where possible, stay on designated paths and trails to protect both the environment and personal safety.",
    },
    {
      key: "9",
      title: "Prevent Contamination and Zoonotic Diseases",
      content:
        "Protect both yourself and wildlife by using hand sanitiser regularly while exploring. Never transfer plants, animals, or other natural elements between environments, especially aquatic life, to prevent the spread of disease.",
    },
    {
      key: "10",
      title: "Weather and Sunset Awareness",
      content:
        "Always check weather conditions and sunset times before heading out. Unexpected weather changes and darkness can pose significant risks.",
    },
    {
      key: "11",
      title: "Avoid Trampling Vegetation",
      content:
        "Some plants thrive in dense vegetation. If capturing an image means trampling plants or risking exposure to nettles and ticks, it’s best to reconsider. Preserve the natural environment by enjoying nature and advocating for its protection.",
    },
  ];

  const renderItem = ({
    item,
  }: {
    item: { title: string; content: string };
  }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  return (
    <FlatList
      data={safetyGuidelines}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 15,
  },
  title: {
    fontWeight: "bold",
    color: "#232325",
    fontSize: 16,
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    color: "#232325",
    lineHeight: 20,
  },
});

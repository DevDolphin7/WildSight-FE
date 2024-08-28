import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";

const instructions = [
  {
    key: "1",
    title: "1. Account Setup (Optional):",
    content: `Create an account to save and track your plant discoveries.
You can use the app as a guest, but your discoveries will only be tracked on the map and won’t be accessible later without an account.`,
  },
  {
    key: "2",
    title: "2. Capture an Image:",
    content: `Tap the camera icon to start.
Use the arrow on the right to switch between the front and back cameras.
Press the button in the centre to take a photo.
Review the image. If satisfied, accept it, or retake the photo.`,
  },
  {
    key: "3",
    title: "3. Identify the Plant:",
    content: `After accepting the image, the AI will suggest possible species with a percentage showing how confident it is.
Select the species you believe is correct from the list.
You’ll automatically see more images and a brief summary of the plant.
If you have an account, you can access this information later in the 'My Wildlife' section.`,
  },
  {
    key: "4",
    title: "4. Explore and Track:",
    content: `Learn more about the plant in the ‘My Wildlife’ section.
Track your discoveries on the map by toggling to 'My Plants'.`,
  },
  {
    key: "5",
    title: "5. Map Features:",
    content: `View the distribution of plants using the heatmap.
Zoom in to see specific locations where each plant was discovered.`,
  },
];

const Instructions: React.FC = () => {
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
      data={instructions}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      style={styles.list}
    />
  );
};

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

export default Instructions;

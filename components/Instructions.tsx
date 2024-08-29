import React from "react";
import { FlatList, Text, View, Image, StyleSheet } from "react-native";

const instructions = [
  {
    key: "1",
    title: "1. Account Setup (Optional):",
    content: `Create an account to save and track your plant discoveries.
You can use the app as a guest, but your discoveries will only be tracked on the map and won’t be accessible later without an account.`,
    images: [],
  },
  {
    key: "2",
    title: "2. Capture an Image:",
    content: `Tap the camera icon to start.
Use the arrow on the right to switch between the front and back cameras.
Press the "take picture" button take a photo.
Review the image. If satisfied, accept it, or retake the photo.
If you have accepted the image, you will be prompted to select which part of the plant you have captured. This allows the AI to learn and also to increase the accuracy of the response.`,
    images: [
      require("@/assets/images/appUsageExamples/3.png"),
      require("@/assets/images/appUsageExamples/4.png"),
    ],
  },
  {
    key: "3",
    title: "3. Identify the Plant:",
    content: `After accepting the image, the AI will suggest possible species with a percentage showing how confident it is.
Select the species you believe is correct from the list.
You’ll automatically see more images and a brief summary of the plant.
If you have an account, you can access this information later in the 'My Wildlife' section.`,
    images: [],
  },
  {
    key: "4",
    title: "4. Explore and Track:",
    content: `Learn more about the plant in the ‘My Wildlife’ section.
The "MY SIGHTINGS page collects all the wildlife you've identified, you can also save these in your favourites by clicking the heart.
The "MY FAVOURITES page saves all of your favourite wildlife, wether you have captures these or discovered them from the map.`,
    images: [
      require("@/assets/images/appUsageExamples/8.png"),
      require("@/assets/images/appUsageExamples/9.png"),
    ],
  },
  {
    key: "5",
    title: "5. Map Features:",
    content: `View the distribution of plants using the heatmap.
Zooming in will allow you to see the individual pins from each specific locations where each plant was discovered.`,
    images: [
      require("@/assets/images/appUsageExamples/6.png"),
      require("@/assets/images/appUsageExamples/7.png"),
    ],
  },
];

const Instructions: React.FC = () => {
  const renderItem = ({
    item,
  }: {
    item: { title: string; content: string; images: any[] };
  }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      {item.images.length > 0 &&
        item.images.map((image, index) => (
          <Image key={index} source={image} style={styles.image} />
        ))}
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
    marginBottom: 20,
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
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
    marginBottom: 10,
  },
});

export default Instructions;

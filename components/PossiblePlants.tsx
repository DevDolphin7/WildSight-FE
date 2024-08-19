import React, { useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";

{
  /* This function is to be used later, the "Score" for the AI's plant certainty is given as a 0 - 1 probability, this function converts
    the probability to a percentage*/
}
function probabilityToPercentage(probability: number): string {
  const percentage = Math.round(probability * 100);
  return `${percentage}%`;
}

interface Plant {
  name: string;
  image_url: string;
  percentage: string;
}

const PlantList = () => {
  const [plants, setPlants] = useState<Plant[]>([
    {
      name: "Rosa gallica",
      image_url:
        "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQuR7lX0NyA7fR4by0KPAr1coxqQD_eH9h7T1Gd-0F0KWDN-Q0b",
      percentage: "85%",
    },
    {
      name: "Quercus robur",
      image_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhjfQbH5vksc09uIFs7VIGYVV7hU2RnIDGy8Nl848ybCTB8Hul",
      percentage: "32%",
    },
    {
      name: "Lavandula angustifolia",
      image_url:
        "https://riversidegardencentre.com/userfiles/product/59258298d6106-lavandula-angustifolia.jpg",
      percentage: "0%",
    },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={plants}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image_url }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.percentage}>{item.percentage}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
    borderRadius: 25,
  },
  textContainer: {
    flexDirection: "column",
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  percentage: {
    fontSize: 14,
    color: "#666",
  },
});

export default PlantList;

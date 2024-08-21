import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types"; // Adjust path as needed

interface Species {
  name?: string;
}

interface ImageDetails {
  url: {
    o: string;
    m: string;
    s: string;
  };
}

type AiResultRouteProp = RouteProp<RootStackParamList, "AiResult">;

const AiResult: React.FC<{ route: AiResultRouteProp }> = ({ route }) => {
  const { data, latPosition, longPosition, photoUri } = route.params;

  console.log(data.results[0]);
  console.log("results");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Results</Text>

      <Text style={styles.subtitle}> Your Image</Text>
      <Image style={styles.image} source={{ uri: photoUri }} />

      <Text style={styles.subtitle}> {data.bestMatch}</Text>
      <Text style={styles.subtitle}>
        {" "}
        Common Name: {data.results[0].species.commonNames}
      </Text>

      <Image
        style={styles.imageMatch}
        source={{ uri: data.results[0].images[0].url.m }}
      />

      <Text style={styles.subtitle}>{data.results[0].score}% accurate</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  image: {
    width: 400,
    height: 300,
    borderRadius: 8,
  },
  imageMatch: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
});

export default AiResult;

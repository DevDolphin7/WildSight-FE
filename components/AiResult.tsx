import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { Button } from "react-native";
import AiSingleResultCard from "./AiSingleResultCard";

interface Species {
  scientificNameWithoutAuthor: string;
  commonNames: string[];
}


interface ImageDetails {
  url: {
    m: string;
    o: string;
    s: string;
  };
}


interface Result {
  gbif: {
    id: number;
  };
  species: Species;
  score: number;
  images: ImageDetails[]; 

}

type AiResultRouteProp = RouteProp<RootStackParamList, "AiResult">;

const AiResult: React.FC<{ route: AiResultRouteProp }> = ({ route }) => {
  const { data, photoUri, latPosition, longPosition } = route.params;
  const { results } = data;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Results</Text>

      {/* User's Image */}
      <Text style={styles.subtitle}>Your Image</Text>
      <Image style={styles.image} source={{ uri: photoUri }} />

      <Text style={styles.subtitle}>Pick which one is most accurate</Text>

      {/* List of results */}
      <View>
        {results.map((result: Result) => {
          return <AiSingleResultCard result={result} key={result.gbif.id} />;
        })}
      </View>

     
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
  paragraph: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
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

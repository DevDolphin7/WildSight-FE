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
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>AI Matches</Text>
        <Text style={styles.subtitle1}>
          Select the option below that looks the closest to add to your
          sightings
        </Text>
        <Image style={styles.image} source={{ uri: photoUri }} />

        <View>
          {results.map((result: Result) => {
            return (
              <AiSingleResultCard
                result={result}
                key={result.gbif?.id}
                photoUri={photoUri}
                latPosition={latPosition}
                longPosition={longPosition}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
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

    marginTop: 32,
    marginBottom: 16,
  },
  subtitle1: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 8,
    borderColor: "black",
  },
  paragraph: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
  },
  image: {
    width: "100%",
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

import React from "react";
import { Button, Text, StyleSheet, View, Image } from "react-native";

// Define the Species and Result interfaces to match the structure expected
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

const handleSubmit = () => {
  console.log("hello")
}


const AiSingleResultCard: React.FC<{ result: Result }> = ({ result }) => {


  return (
    <View style={styles.card}>
      


       <Image style={styles.imageMatch} source={{ uri: result.images[0].url.m}} />


     <Text style={styles.subtitle}>{result.score}% accurate</Text>

      <Text style={styles.subtitle}>Best Match</Text>
      <Text style={styles.paragraph}>Hello</Text>
      <Text style={styles.subtitle}>
        Scientific Name: {result.species.scientificNameWithoutAuthor}
      </Text>
      <Text style={styles.subtitle}>
        Also called: {result.species.commonNames.join(", ")}
      </Text>
      <Button title="Use This One" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 12,
  },imageMatch: {
    width: 300,
    height: 200,
    borderRadius: 8,
  },
});

export default AiSingleResultCard;

import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, StyleSheet, Button } from "react-native";
import { getFavouritesById } from "@/app/WildSight-api";
import { getSightingById } from "@/app/WildSight-api";
import { RootStackParamList } from "@/types";
import { RouteProp } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import SingleSighting from "./SingleSIghting";


type Favourite = {
  sighting_id: number;
  user_id: number;
  uploaded_image: string;
  sighting_date: string;
  lat_position: number;
  long_position: number;
  common_name: string;
  taxon_name: string;
  wikipedia_url: string;
  unique_id: number;
};




export default function MyWildlife() {
  const [favourites, setFavourites] = useState([]);
  const [userId, setUserId] = useState(1);

  const navigation = useNavigation();

  useEffect(() => {
    getFavouritesById(userId)
      .then((data) => {
        setFavourites(data);
      })
      .catch((error) => {
        console.error("Error fetching favourites:", error);
      });
  }, [userId]);

  const handleSubmit = () => {
    let sightings;
    getSightingById(userId).then((response) => {
        console.log(response.sighting_id);
        sightings = response
        navigation.navigate('Single Sighting', { sightings: sightings });

    });
  }

  return (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>
            Your Favourites 
          </Text>
      {favourites.map((favourite: Favourite) => (
        <View key={favourite.sighting_id} style={styles.itemContainer}>
          

          <Text style={styles.text}>Sighting ID: {favourite.sighting_id}</Text>
          <Image
            style={styles.image}
            source={{ uri: favourite.uploaded_image }}
          />
          <Text style={styles.text}>Longitude: {favourite.long_position}</Text>
          <Text style={styles.text}>Taxon Name: {favourite.taxon_name}</Text>
          <Text style={styles.text}>
            Wikipedia URL: {favourite.wikipedia_url}
          </Text>
          <Text style={styles.text}>Unique ID: {favourite.unique_id}</Text>
          <Button title="View" onPress={handleSubmit}>

          </Button>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
  },
  itemContainer: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 12,

  }
});

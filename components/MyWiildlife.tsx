import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";
import { getFavouritesById } from "@/app/WildSight-api";
import { getSightingById } from "@/app/WildSight-api";
import { deleteFavouritesById } from "@/app/WildSight-api";
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
        return data
      })
      .catch((error) => {
        console.error("Error fetching favourites:", error);
      });
  }, [userId, favourites]);

  const handleSubmit = (sighting_id: number) => {
    console.log(sighting_id)
    let sightings;

    getSightingById(sighting_id).then((response) => {
      console.log(response.sighting_id);
      sightings = response;
      navigation.navigate("Single Sighting", { sightings: sightings });
    });
  };

  const handleFavourite = (sighting_id: number) => {
    //check by user id and sighting id if its been favourited
    // if it has, when clicked, sighting is removed from favourite. useeffect reupdates
    // onky functionality as you wont be able to like a post that does exist here

    deleteFavouritesById(userId, sighting_id)
      .then((response) => {
        console.log("inside delete");

      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ScrollView style={styles.container}>
       
      <Text style={styles.title}>Your Favourites</Text>
      {favourites.map((favourite: Favourite) => (
        <View key={favourite.unique_id} style={styles.itemContainer}>
          <Text style={styles.text}>Sighting ID: {favourite.sighting_id}</Text>
          <Button
            title="Like"
            onPress={() => handleFavourite(favourite.sighting_id)}
          >
            {" "}
          </Button>
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
          <Button title="View"  onPress={() => handleSubmit(favourite.sighting_id)}></Button>
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
  },
});

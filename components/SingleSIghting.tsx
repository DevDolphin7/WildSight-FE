import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import { useState, useEffect } from "react";
import { getFavouritesById, getSightingById } from "@/app/WildSight-api";
import { ScrollView } from "react-native-gesture-handler";
import { deleteFavouritesById, addFavouritesById } from "@/app/WildSight-api";



export default function SingleSighting() {
    const route = useRoute();
  
    const [favourite, setFavourite] = useState({});
    const [liked, setLiked] = useState(true);
    const [userId, setUserId] = useState(1);
  
    useEffect(() => {
      // Fetch sighting data
      getSightingById(route.params.sightings.sighting_id).then((response) => {
        setFavourite(response);

  
        // Fetch user favourites and check if this sighting is liked
        getFavouritesById(userId).then((favourites) => {


          const isLiked = favourites.some(
            (wildlife) =>
              wildlife.sighting_id === favourite.sighting_id &&
              wildlife.user_id === userId
          );
          console.log(isLiked, "before")
          if (isLiked) {
            setLiked(true)
          }
          else if (!isLiked) {
            setLiked(false)
          }
          
          
          console.log(liked, "after")
        });
      });
    }, [userId, liked]);
  
    const addLike = (sighting_id: number) => {
      
        addFavouritesById(userId, sighting_id)
          .then((response) => {
            setLiked(true);
            console.log("Sighting added to favourites.");

            return response
          })
          .catch((err) => {
            console.log(err);
          });
      
    };


    const deleteLike = (sighting_id: number) => {
      
          deleteFavouritesById(userId, sighting_id)
            .then(() => {
              setLiked(false);
  
              console.log("Sighting removed from favourites.");
            })
            .catch((err) => {
              console.log(err);
            });
            
      };
  
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{favourite.common_name}</Text>
          <Button
            title="Add to Favourites"
            onPress={() => addLike(favourite.sighting_id)}
          />
          <Button
            title="Remove from favourites"
            onPress={() => deleteLike(favourite.sighting_id)}
          />



          <Image
            style={styles.image}
            source={{ uri: favourite.uploaded_image }}
          />
          <Text>{favourite.sighting_date}</Text>
          <Text>{favourite.taxon_name}</Text>
          <Text>{favourite.wikipedia_url}</Text>
        </View>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      padding: 15,
    },
    image: {
      width: 400,
      height: 400,
      borderWidth: 1,
      borderRadius: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
    },
  });

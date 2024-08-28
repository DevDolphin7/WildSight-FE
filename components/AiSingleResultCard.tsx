import React from "react";
import { Button, Text, StyleSheet, View, Image } from "react-native";
import {
  getINatObservationById,
  getObservIdBySciName,
} from "@/app/iNaturalist-api";
import { addUserSighting } from "@/app/WildSight-api";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

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

interface AiSingleResultCardProps {
  result: Result;
  photoUri: string;
  latPosition: number;
  longPosition: number;
}

//User ID in useContext?
const AiSingleResultCard: React.FC<AiSingleResultCardProps> = ({
  result,
  photoUri,
  latPosition,
  longPosition,
}) => {
  const navigation = useNavigation();

  const handleSubmit = () => {
    const scientificName = result.species.scientificNameWithoutAuthor;
    getObservIdBySciName(scientificName).then((iNatId) => {
      getINatObservationById(iNatId).then((observation) => {
        const uploaded_image = photoUri;
        const long_position = longPosition;
        const lat_position = latPosition;
        const common_name = result.species.commonNames[0];
        const taxon_name = scientificName;
        // not actually the wiki url but instead the summary - can change BE column name to wiki summary and update FE too
        const wikipedia_url = observation.taxon.wikipedia_summary.replace(
          /<\/?[^>]+(>|$)/g,
        
        );

        const userSighting = {
          uploaded_image,
          long_position,
          lat_position,
          common_name,
          taxon_name,
          wikipedia_url,
        };
        console.log(userSighting);
        const user_id = 1;
        addUserSighting(user_id, userSighting)
          .then((response) => {
            const newSightingId = response.newSighting.sighting_id;
            navigation.navigate("SingleWildlife", {
              WildSightSightingId: newSightingId,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardtitle}>Scientific Name</Text>
      <Text style={styles.cardtitle1}>
        {result.species.scientificNameWithoutAuthor}
      </Text>
      <Text style={styles.cardsubtitle}>
        {(result.score * 100).toFixed(0)}% accurate
      </Text>

      <Image
        style={styles.imageMatch}
        source={{ uri: result.images[0].url.m }}
      />

      <Text style={styles.text}>Also called</Text>
      <Text style={styles.text1}>{result.species.commonNames.join(", ")}</Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>

        <Text style={styles.select}>Select</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
	marginTop: 16,
    borderRadius: 8,
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
  },
  imageMatch: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  cardtitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  cardsubtitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingTop: 4,
    paddingBottom: 4,
    textAlign: "right",
  },
  cardsubtitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingTop: 4,
    paddingBottom: 4,
    textAlign: "right",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  text1: {
    fontSize: 16,
  },
  containerButton: {},
  button: {
    width: "100%",
	alignSelf: "flex-end",


    padding: 12,

    alignContent: "center",
    backgroundColor: "#215140",
    borderRadius: 8,
	alignItems: "center"
  },
  select: {
	fontSize: 24,
    fontWeight: "bold",
    color: "white",
  }
});

export default AiSingleResultCard;

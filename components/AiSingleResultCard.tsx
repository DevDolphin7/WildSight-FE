import React, { useState } from "react";
import {
  Button,
  Text,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  getINatObservationById,
  getObservIdBySciName,
} from "@/app/iNaturalist-api";
import { addUserSighting } from "@/app/WildSight-api";
import { useNavigation } from "@react-navigation/native";

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
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const handleSubmit = () => {
    setLoading(true);
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
          ""
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
            setLoading(false);
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
      <Image
        style={styles.imageMatch}
        source={{ uri: result.images[0].url.m }}
      />

      <Text style={styles.subtitle}>
        {(result.score * 100).toFixed(0)}% accurate
      </Text>

      <Text style={styles.subtitle}>
        Scientific Name: {result.species.scientificNameWithoutAuthor}
      </Text>
      <Text style={styles.subtitle}>
        Also called: {result.species.commonNames.join(", ")}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#215140" />
      ) : (
        <Button
          color="#215140"
          title="Add to My Sightings"
          onPress={handleSubmit}
        />
      )}
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
  },
  imageMatch: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
});

export default AiSingleResultCard;

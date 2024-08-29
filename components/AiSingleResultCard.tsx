import React, { useState, useContext } from "react";
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

import { TouchableOpacity } from "react-native-gesture-handler";

import { LoggedInContext } from "@/contexts/LoggedIn";

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

const AiSingleResultCard: React.FC<AiSingleResultCardProps> = ({
  result,
  photoUri,
  latPosition,
  longPosition,
}) => {
  const { loggedIn } = useContext(LoggedInContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  let user_id = 1;
  if (loggedIn !== null) {
    user_id = loggedIn.user_id;
  }

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
        const wikipedia_url = observation.taxon.wikipedia_summary
          .replace(/<\/?[^>]+(>|$)/g, "")
          .substring(0, 255);
        const userSighting = {
          uploaded_image,
          long_position,
          lat_position,
          common_name,
          taxon_name,
          wikipedia_url,
        };
        console.log(userSighting);
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
      <View style={styles.titleContainer}>
        <View style={styles.titleTextContainer}>
          <Text style={styles.cardtitle}>Scientific Name</Text>
          <Text style={styles.cardtitle1}>
            {result.species.scientificNameWithoutAuthor}
          </Text>
        </View>
        <Text style={styles.cardsubtitle}>
          {(result.score * 100).toFixed(0)}% accurate
        </Text>
      </View>

      <Image
        style={styles.imageMatch}
        source={{ uri: result.images[0].url.m }}
      />

      <Text style={styles.text}>Also called</Text>
      <Text style={styles.text1}>{result.species.commonNames.join(", ")}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#215140" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.select}>Select</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    padding: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  titleTextContainer: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  cardtitle1: {
    fontSize: 14,
    fontWeight: "600",
  },
  cardsubtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "right",
  },
  imageMatch: {
    width: "100%",
    height: 190,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  text1: {
    fontSize: 16,
    marginBottom: 6,
  },
  button: {
    width: "100%",
    alignSelf: "flex-end",
    padding: 8,
    backgroundColor: "#215140",
    borderRadius: 8,
    alignItems: "center",
  },
  select: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

export default AiSingleResultCard;

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  getSightingById,
  addFavouritesById,
  deleteFavouritesById,
} from "../app/WildSight-api";
import { getINatObservationById } from "../app/iNaturalist-api";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LoggedInContext } from "@/contexts/LoggedIn";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SingleWildlife() {
  const [singleWildlife, setSingleWildlife] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const route = useRoute();
  const { iNatId, WildSightSightingId } = route.params;
  const navigation = useNavigation();
  const { loggedIn } = useContext(LoggedInContext);

  let user_id = 1;
  if (loggedIn !== null) {
    user_id = loggedIn.user_id;
  }

  useEffect(() => {
    if (iNatId) {
      getINatObservationById(iNatId)
        .then((observation) => {
          setSingleWildlife(observation);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    } else if (WildSightSightingId) {
      getSightingById(WildSightSightingId)
        .then((sighting) => {
          setSingleWildlife(sighting);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    } else {
      setLoading(false);
    }
  }, [iNatId, WildSightSightingId]);

  const handleNavigateToExplore = () => {
    navigation.navigate("explore");
  };

  const handleFavorite = () => {
    if (isFavorite) {
      deleteFavouritesById(user_id, WildSightSightingId || iNatId)
        .then(() => setIsFavorite(false))
        .catch((error) => console.error("Error removing favorite:", error));
    } else {
      addFavouritesById(user_id, WildSightSightingId || iNatId)
        .then(() => setIsFavorite(true))
        .catch((error) => console.error("Error adding to favorites:", error));
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView>
          {!WildSightSightingId && !iNatId ? (
            <View>
              <Text>No sighting ID found</Text>
            </View>
          ) : (
            <View>
              {WildSightSightingId ? (
                <View>
                  <View style={styles.headerContainer}>
                    <Text style={styles.speciesGuess}>
                      {singleWildlife?.common_name}
                    </Text>
                    {/* Show heart icon only for WildSightSightingId */}
                    <Icon
                      name="heart"
                      size={28}
                      color={isFavorite ? "red" : "grey"}
                      onPress={handleFavorite}
                      style={styles.heartIcon}
                    />
                  </View>
                  <Text style={styles.observerInfo}>
                    User ID: {singleWildlife?.user_id}
                  </Text>
                  <Image
                    source={{
                      uri: singleWildlife?.uploaded_image,
                    }}
                    style={styles.fullWidthImage}
                  />
                  <Text style={styles.summaryTitle}>Wikipedia Summary:</Text>
                  <Text style={styles.summaryText}>
                    {singleWildlife?.wikipedia_url
                      ? singleWildlife?.wikipedia_url.replace(
                          /<\/?[^>]+(>|$)/g,
                          ""
                        )
                      : null}
                  </Text>
                </View>
              ) : null}
              {iNatId ? (
                <View>
                  <Text style={styles.speciesGuess}>
                    {singleWildlife.species_guess}
                  </Text>
                  <Text style={styles.observerInfo}>
                    {singleWildlife.user?.name
                      ? `Observer: ${singleWildlife.user.name}`
                      : null}
                  </Text>
                  <Text style={styles.observationsCount}>
                    Observations: {singleWildlife.user?.observations_count}
                  </Text>
                  {singleWildlife.taxon?.default_photo?.medium_url && (
                    <Image
                      source={{
                        uri: singleWildlife.taxon.default_photo.medium_url,
                      }}
                      style={styles.fullWidthImage}
                    />
                  )}
                  <Text style={styles.summaryTitle}>Wikipedia Summary:</Text>
                  <Text style={styles.summaryText}>
                    {singleWildlife.taxon?.wikipedia_summary.replace(
                      /<\/?[^>]+(>|$)/g,
                      ""
                    )}
                  </Text>
                  <View style={styles.observationPhotosContainer}>
                    <Text style={styles.photosTitle}>User Photos:</Text>
                    {singleWildlife.observation_photos?.map((photo, index) => (
                      <Image
                        key={index}
                        source={{ uri: photo.photo.url }}
                        style={styles.smallPhoto}
                      />
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>
      )}
      <TouchableOpacity
        style={styles.myWildlifeButton}
        onPress={handleNavigateToExplore}
      >
        <Text style={styles.myWildlifeButtonText}>Go to My Wildlife</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  speciesGuess: {
    fontSize: 28,
    fontWeight: "bold",
  },
  heartIcon: {
    marginLeft: 10,
  },
  fullWidthImage: {
    height: 250,
    marginBottom: 20,
  },
  observerInfo: {
    marginTop: 10,
  },
  observationsCount: {
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  summaryText: {
    fontSize: 16,
    marginTop: 10,
  },
  observationPhotosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  photosTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  smallPhoto: {
    width: 60,
    height: 60,
    margin: 5,
  },
  myWildlifeButton: {
    backgroundColor: "#215140",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
  },
  myWildlifeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

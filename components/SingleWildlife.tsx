import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { getINatObservationById } from "../app/iNaturalist-api";
import { useRoute } from "@react-navigation/native";
import { getSightingById } from "@/app/WildSight-api";

export default function SingleWildlife() {
  const [singleWildlife, setSingleWildlife] = useState({});
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { iNatId, WildSightSightingId } = route.params;

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
                  <Text style={styles.speciesGuess}>
                    {singleWildlife?.common_name}
                  </Text>
                  <Text style={styles.observerInfo}>User ID: {}</Text>
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
  speciesGuess: {
    fontSize: 28,
    fontWeight: "bold",
  },
  fullWidthImage: {
    height: 250,
    marginBottom: 20,
	borderRadius: 8,
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
});

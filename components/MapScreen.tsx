import React, { useState, useEffect, useContext } from "react";
import MapView, {
  Heatmap,
  Marker,
  Region,
  Callout,
  Circle,
} from "react-native-maps";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Platform,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { getINatObservations } from "@/app/iNaturalist-api";
import { useNavigation } from "@react-navigation/native";
import { getSightingsByUserId } from "@/app/WildSight-api";
import { LoggedInContext } from "@/contexts/LoggedIn";

export default function MapScreen() {
  const { loggedIn } = useContext(LoggedInContext);

  let user_id = 1;
  if (loggedIn !== null) {
    user_id = loggedIn.user_id;
  }
  const [points, setPoints] = useState([
    { latitude: 50.2025577053117, longitude: -5.140539490248174, weight: 1 },
  ]);
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [region, setRegion] = useState<Region | null>(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userSightings, setUserSightings] = useState([]);
  const [showUserSightings, setShowUserSightings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") {
          Alert.alert(
            "Location access denied. Please allow access in Phone settings"
          );
          return Promise.reject("Location permission not granted");
        }
        return Location.getCurrentPositionAsync({});
      })
      .then((data) => {
        const { latitude, longitude } = data.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.035,
          longitudeDelta: 0.035,
        });
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (!region) return;
    console.log(user_id);
    const nelat = region.latitude + region.latitudeDelta / 2;
    const nelng = region.longitude + region.longitudeDelta / 2;
    const swlat = region.latitude - region.latitudeDelta / 2;
    const swlng = region.longitude - region.longitudeDelta / 2;
    setIsLoading(true);
    Promise.all([
      getINatObservations(nelat, nelng, swlat, swlng, 200).then(
        (observations) => {
          return observations.map((observation: any) => {
            const imageUrl = observation.taxon?.default_photo?.medium_url;
            return {
              latitude: observation.geojson.coordinates[1],
              longitude: observation.geojson.coordinates[0],
              weight: 1,
              imageUrl: imageUrl,
              species_guess: observation.species_guess,
              id: observation.id,
            };
          });
        }
      ),
      getSightingsByUserId(user_id, nelat, nelng, swlat, swlng)
        .then((sightings) => {
          if (sightings.length > 0) {
            const userPoints = sightings.map((sighting: any) => {
              const imageUrl = sighting.uploaded_image;
              return {
                latitude: sighting.lat_position,
                longitude: sighting.long_position,
                weight: 1,
                imageUrl: imageUrl,
                species_guess: sighting.common_name,
                sighting_id: sighting.sighting_id,
              };
            });
            setUserSightings(userPoints);
            return userPoints;
          } else {
            return [];
          }
        })
        .catch((err) => {
          console.log("in err for get ws sightings", err);
          return [];
        }),
    ])
      .then(([inatPoints, userPoints]) => {
        if (userPoints.length > 0) {
          setPoints([...inatPoints, ...userPoints]);
        } else {
          setPoints(inatPoints);
        }
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, [region]);

  const getCircleRadius = (zoomLevel: number) => {
    if (zoomLevel >= 18) return 5;
    if (zoomLevel >= 15) return 20;
    if (zoomLevel >= 13) return 50;
    if (zoomLevel >= 10) return 100;
    if (zoomLevel >= 8) return 200;
    if (zoomLevel >= 5) return 400;
    return 800;
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    const newZoomLevel =
      Math.log(
        360 / Math.max(newRegion.longitudeDelta, newRegion.latitudeDelta)
      ) / Math.LN2;
    setZoomLevel(newZoomLevel);
    setRegion(newRegion);
  };

  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
  };

  const handleViewDetails = () => {
    if (selectedMarker.sighting_id) {
      navigation.navigate("SingleWildlife", {
        WildSightSightingId: selectedMarker.sighting_id,
      });
    } else {
      navigation.navigate("SingleWildlife", {
        iNatId: selectedMarker.id,
      });
    }
  };

  const handleClose = () => {
    setSelectedMarker(null);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}

      {showPopup && (
        <Modal transparent={true} visible={showPopup} animationType="fade">
          <View style={styles.popupContainer}>
            <View style={styles.popupContent}>
              <TouchableOpacity
                onPress={handleClosePopup}
                style={styles.closeButtonPopup}
              >
                <Text style={styles.closeButtonTextPopup}>X</Text>
              </TouchableOpacity>
              <Text style={styles.popupHeadingTop}>Wildlife Sightings Map</Text>
              <Text style={styles.popupText}>
                This map showcases wildlife sightings in your area. The heatmap
                indicates regions with higher concentrations of sightings.
              </Text>
              <Text style={styles.popupHeading}>
                Explore Individual Sightings
              </Text>
              <Text style={styles.popupText}>
                You can zoom in to explore individual sightings and learn more
                about various plants and animals.
              </Text>
              <Text style={styles.popupHeading}>Toggle Your Sightings</Text>
              <Text style={styles.popupText}>
                Additionally, you can toggle the map to display only your
                personal sightings.
              </Text>
            </View>
          </View>
        </Modal>
      )}

      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => setShowPopup(true)}
      >
        <Text style={styles.infoButtonText}>i</Text>
      </TouchableOpacity>

      <Pressable
        style={styles.toggleButton}
        onPress={() => setShowUserSightings(!showUserSightings)}
      >
        <Text style={styles.toggleButtonText}>
          {showUserSightings ? "Show All Sightings" : "Show My Sightings"}
        </Text>
      </Pressable>

      {region && (
        <MapView
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {showUserSightings ? (
            userSightings.map((point, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                onPress={() => handleMarkerPress(point)}
                pinColor="blue"
              >
                <Callout>
                  <View>
                    <Text>{point.species_guess || "Species Unknown"}</Text>
                  </View>
                </Callout>
              </Marker>
            ))
          ) : zoomLevel < 17 ? (
            Platform.OS === "android" ? (
              <Heatmap
                radius={30}
                opacity={1}
                points={points.map((point) => ({
                  latitude: point.latitude,
                  longitude: point.longitude,
                  weight: point.weight,
                }))}
              />
            ) : (
              points.map((point, index) => (
                <Circle
                  key={index}
                  center={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  radius={getCircleRadius(zoomLevel)}
                  strokeColor="rgba(255, 0, 0, 0.2)"
                  fillColor="rgba(255, 0, 0, 0.5)"
                  strokeWidth={6}
                />
              ))
            )
          ) : (
            points.map((point, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                onPress={() => handleMarkerPress(point)}
              >
                <Callout>
                  <View>
                    <Text>{point.species_guess || "Species Unknown"}</Text>
                  </View>
                </Callout>
              </Marker>
            ))
          )}
        </MapView>
      )}

      {selectedMarker && (
        <View style={styles.sightingInfoContainer}>
          {selectedMarker.imageUrl && (
            <Image
              source={{ uri: selectedMarker.imageUrl }}
              style={styles.popUpImage}
            />
          )}
          <View style={styles.sightingTextContainer}>
            <View style={styles.headerRow}>
              <Text>Species: {selectedMarker.species_guess}</Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleViewDetails}>
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  toggleButton: {
    position: "absolute",
    top: 50,
    left: 70,
    backgroundColor: "#215140",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    zIndex: 1,
  },
  toggleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sightingInfoContainer: {
    position: "absolute",
    bottom: 60,
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
  },
  popUpImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  sightingTextContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#d6d6d6",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#215140",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    alignSelf: "flex-start",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  loadingContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingVertical: 4,
    alignItems: "center",
    zIndex: 2,
  },
  loadingText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    position: "relative",
  },
  closeButtonPopup: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#d6d6d6",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonTextPopup: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  popupHeadingTop: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#232325",
  },
  popupHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#232325",
  },
  popupText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    color: "#232325",
  },

  infoButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#215140",
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  infoButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

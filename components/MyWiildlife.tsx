import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Button,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import {
  getFavouritesById,
  getSightingsByUserId,
  deleteFavouritesById,
  addFavouritesById,
} from "@/app/WildSight-api";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LoggedInContext } from "@/contexts/LoggedIn";
import Icon from "react-native-vector-icons/FontAwesome";

export default function MyWildlife() {
  const { loggedIn } = useContext(LoggedInContext);
  let user_id = 1;
  if (loggedIn !== null) {
    user_id = loggedIn.user_id;
  }

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "sightings", title: "My Sightings" },
    { key: "favourites", title: "My Favourites" },
  ]);

  const [sightings, setSightings] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [refreshFavourites, setRefreshFavourites] = useState(false);
  const [showRemovalMessage, setShowRemovalMessage] = useState(false);
  const [showAddMessage, setShowAddMessage] = useState(false);

  const navigation = useNavigation();

  // Fetch data when the tab gains focus
  useFocusEffect(
    useCallback(() => {
      getSightingsByUserId(user_id, 50.5, -4.5, 50, -5.3)
        .then((data) => {
          setSightings(data);
        })
        .catch((error) => {
          console.error("Error fetching sightings:", error);
        });

      getFavouritesById(user_id)
        .then((data) => {
          setFavourites(data);
        })
        .catch((error) => {
          console.error("Error fetching favourites:", error);
        });
    }, [user_id, refreshFavourites])
  );

  const handleFavouriteDelete = (sighting_id: number) => {
    deleteFavouritesById(user_id, sighting_id)
      .then(() => {
        setFavourites((prevFavourites) =>
          prevFavourites.filter((fav) => fav.sighting_id !== sighting_id)
        );
        setShowRemovalMessage(true);
        setTimeout(() => setShowRemovalMessage(false), 1200);
      })
      .catch((err) => {
        console.error("Error deleting favourite:", err);
      });
  };

  const handleAddToFavorites = (sighting_id: number) => {
    addFavouritesById(user_id, sighting_id)
      .then(() => {
        setRefreshFavourites((prev) => !prev);
        setShowAddMessage(true);
        setTimeout(() => setShowAddMessage(false), 1200);
      })
      .catch((err) => {
        console.error("Error adding to favorites:", err);
      });
  };

  const handleRemoveFromFavorites = (sighting_id: number) => {
    deleteFavouritesById(user_id, sighting_id)
      .then(() => {
        setRefreshFavourites((prev) => !prev);
        setShowRemovalMessage(true);
        setTimeout(() => setShowRemovalMessage(false), 1200);
      })
      .catch((err) => {
        console.error("Error removing from favorites:", err);
      });
  };

  const SightingsRoute = () => (
    <ScrollView style={styles.container}>
      {sightings.map((sighting) => {
        const isAlreadyFavourite = favourites.some(
          (favourite) => favourite.sighting_id === sighting.sighting_id
        );

        return (
          <View key={sighting.sighting_id} style={styles.itemContainer}>
            <Image
              style={styles.image}
              source={{ uri: sighting.uploaded_image }}
            />
            <View style={styles.textContainer}>
              <Text style={styles.text}>{sighting.common_name}</Text>
              <Text style={styles.text}>
                Spotted on:{" "}
                {new Date(sighting.sighting_date).toLocaleDateString("en-GB")}
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  color="#215140"
                  title="View"
                  onPress={() =>
                    navigation.navigate("SingleWildlife", {
                      WildSightSightingId: sighting.sighting_id,
                    })
                  }
                />
              </View>
            </View>
            <Icon
              name="heart"
              size={28}
              color={isAlreadyFavourite ? "red" : "grey"}
              onPress={() => {
                if (isAlreadyFavourite) {
                  handleRemoveFromFavorites(sighting.sighting_id);
                } else {
                  handleAddToFavorites(sighting.sighting_id);
                }
              }}
              style={styles.heartIcon}
            />
          </View>
        );
      })}
    </ScrollView>
  );

  const FavouritesRoute = () => (
    <ScrollView style={styles.container}>
      {favourites.map((favourite) => (
        <View key={favourite.unique_id} style={styles.itemContainer}>
          <Image
            style={styles.image}
            source={{ uri: favourite.uploaded_image }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{favourite.common_name}</Text>
            <Text style={styles.text}>
              Spotted on:{" "}
              {new Date(favourite.sighting_date).toLocaleDateString("en-GB")}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                color="#215140"
                title="View Details"
                onPress={() =>
                  navigation.navigate("SingleWildlife", {
                    WildSightSightingId: favourite.sighting_id,
                  })
                }
              />
            </View>
          </View>
          <Icon
            name="heart"
            size={28}
            color="red"
            onPress={() => handleFavouriteDelete(favourite.sighting_id)}
            style={styles.heartIcon}
          />
        </View>
      ))}
    </ScrollView>
  );

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: "#215140" }}
      labelStyle={{ color: "white", fontWeight: "bold" }}
      activeColor="white"
      inactiveColor="#a5ccc0"
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.greetingText}>
        Welcome, {loggedIn ? loggedIn.username : "Guest"}
      </Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          sightings: SightingsRoute,
          favourites: FavouritesRoute,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: 300 }}
        renderTabBar={renderTabBar}
        style={styles.tabView}
      />
      {showAddMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Sighting added to favourites</Text>
        </View>
      )}
      {showRemovalMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Sighting removed from favourites
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "35%",
    height: "100%",
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 28,
  },
  tabView: {
    marginTop: 0,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 0,
    textAlign: "center",
    backgroundColor: "#a5ccc0",
    padding: 10,
  },
  removalMessageContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingVertical: 4,
    alignItems: "center",
    zIndex: 2,
  },
  removalMessageText: {
    color: "#232325",
    fontSize: 14,
    fontWeight: "bold",
  },
  messageContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingVertical: 4,
    alignItems: "center",
    zIndex: 2,
  },
  messageText: {
    color: "#232325",
    fontSize: 14,
    fontWeight: "bold",
  },
});

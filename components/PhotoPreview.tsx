import * as MediaLibrary from "expo-media-library";
import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Button, Alert } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

type PhotoPreviewRouteProp = RouteProp<RootStackParamList, "PhotoPreview">;
type PhotoPreviewNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PhotoPreview"
>;

interface PhotoPreviewProps {
  route: PhotoPreviewRouteProp;
  navigation: PhotoPreviewNavigationProp;
}

const PhotoPreviewScreen: React.FC<PhotoPreviewProps> = ({
  route,
  navigation,
}) => {
  const { photoUri, latPosition, longPosition } = route.params;
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState<boolean>(false);

  useEffect(() => {
    MediaLibrary.requestPermissionsAsync()
      .then(({ status }) => {
        setHasMediaLibraryPermission(status === "granted");
      })
      .catch((err) => {
        console.error("Error requesting media library permissions:", err);
      });
  }, []);

  const savePhoto = async () => {
    if (hasMediaLibraryPermission) {
      try {
        const asset = await MediaLibrary.createAssetAsync(photoUri);
        if (asset) {
          Alert.alert("Success", "Photo saved to gallery!");
        } else {
          Alert.alert("Error", "Failed to save photo.");
        }
      } catch (error) {
        console.error("Error saving photo:", error);
        Alert.alert("Error", "An error occurred while saving the photo.");
      }
    } else {
      Alert.alert(
        "Permission Denied",
        "You need to grant media library permissions to save photos."
      );
    }
  };

  const handleUsePhoto = () => {
    navigation.navigate("PlantIdentification", {
      photoUri,
      latPosition,
      longPosition,
    });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />
      <View style={styles.buttonContainer}>
        <Button
          title="Retake Photo"
          onPress={() => navigation.navigate("Camera")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Use Photo" onPress={handleUsePhoto} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: 300,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "60%",
    marginVertical: 15,
  },
});

export default PhotoPreviewScreen;

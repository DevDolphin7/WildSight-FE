import * as MediaLibrary from "expo-media-library";
import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Alert, Text, Dimensions } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";

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

    Alert.alert(
      "Choose an Organ Type",
      "This is the specific part of the plant. Choosing the correct part of the plant will improve the accuracy of the AI."
    );
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { width: screenWidth * 0.8 }]}
          onPress={handleUsePhoto}
        >
          <Text style={styles.buttonText}>Use Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.retakePhotoButton,
            { width: screenWidth * 0.8 },
          ]}
          onPress={() => navigation.navigate("Camera")}
        >
          <Text style={styles.buttonText}>Retake Photo</Text>
        </TouchableOpacity>
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
    height: 400,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#215140",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  retakePhotoButton: {
    backgroundColor: "#a5ccc0",
  },
});

export default PhotoPreviewScreen;

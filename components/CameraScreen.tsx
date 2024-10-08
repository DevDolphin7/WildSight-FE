import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import FontAwesome from "react-native-vector-icons/FontAwesome";

type CameraScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Camera"
>;

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [latPosition, setLatPosition] = useState(0);
  const [longPosition, setLongPosition] = useState(0);
  const [photoUri, setPhotoUri] = useState<string>("");
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation<CameraScreenNavigationProp>();

  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") {
          Alert.alert("Permission to access location denied");
          return Promise.reject("Location permission not granted");
        }
        return Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (location) => {
            setLatPosition(location.coords.latitude);
            setLongPosition(location.coords.longitude);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      Location.hasServicesEnabledAsync().then((enabled) => {
        if (enabled) {
          Location.stopLocationUpdatesAsync();
        }
      });
    };
  }, []);

  const takePicture = () => {
    if (cameraRef.current) {
      cameraRef.current
        .takePictureAsync()
        .then((photo) => {
          if (photo && photo.uri) {
            setPhotoUri(photo.uri);
            navigation.navigate("PhotoPreview", {
              photoUri: photo.uri,
              latPosition: latPosition,
              longPosition: longPosition,
            });
          } else {
            Alert.alert("Error", "Could not take picture");
          }
        })
        .catch((error) => {
          Alert.alert("Error", "An error occurred while taking the picture");
          console.error(error);
        });
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  if (!mediaLibraryPermission || !mediaLibraryPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to save photos to the gallery
        </Text>
        <Button
          onPress={requestMediaLibraryPermission}
          title="Grant Gallery Permission"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            {/* <Text style={styles.flipText}>Flip</Text> */}
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.circleButton}>
              <FontAwesome name="camera" size={40} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    marginBottom: 64,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  captureButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#215140",
    borderWidth: 5,
    borderColor: "#a5ccc0",
    alignItems: "center", // Center the icon horizontally
    justifyContent: "center", // Center the icon vertically
  },
  cameraIcon: {
    width: 40,
    height: 40,
  },
  flipButton: {
    position: "absolute",
    left: 95,
    bottom: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  flipText: {
    fontSize: 20,
    color: "white",
  },
});

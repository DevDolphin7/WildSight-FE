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
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    isLoading(true);
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") {
          Alert.alert("Permission to access location denied");
          return Promise.reject("Location permission not granted");
        }
        return Location.getCurrentPositionAsync({});
      })
      .then((data) => {
        setLatPosition(data.coords.latitude);
        setLongPosition(data.coords.longitude);
      })
      .catch((err) => {
        console.log(err);
      });
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
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      ></CameraView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>Take Picture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    width: "100%",
    height: "50%",
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  button: {
    margin: 10,
    padding: 12,
    alignSelf: "flex-end",
    // backgroundColor: "#215140",
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: 1,
    width: 150,
    flex: 1,
    flexDirection: "row",
    marginBottom: 64,
    justifyContent: "center",
    alignItems: "flex-end",
  },

  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

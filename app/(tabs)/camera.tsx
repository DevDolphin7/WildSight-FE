import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import React, { useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [zoom, setZoom] = useState(0); 

  const [
    mediaLibraryPermission,
    requestMediaLibraryPermission,
  ] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);
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
  async function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function zoomIn() {
    setZoom((prevZoom) => Math.min(prevZoom + 0.001, 1)); 
  }

  function zoomOut() {
    setZoom((prevZoom) => Math.max(prevZoom - 0.001, 0)); 
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo && photo.uri) {
          await MediaLibrary.createAssetAsync(photo.uri);
          Alert.alert("Photo taken", `Photo saved to gallery at ${photo.uri}`);
        } else {
          Alert.alert("Error", "Could not take picture");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while taking the picture");
      }
    }
  }
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} zoom={zoom} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
		<TouchableOpacity style={styles.button} onPress={zoomIn}>
            <Text style={styles.text}>Zoom In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={zoomOut}>
            <Text style={styles.text}>Zoom Out</Text>
          </TouchableOpacity>
		  
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
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
    flexDirection: 'column',
    backgroundColor: "transparent",
    margin: 64,
    justifyContent: "space-around",
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

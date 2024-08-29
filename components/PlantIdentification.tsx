import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import { RootStackParamList } from "../types";
import { Picker } from "@react-native-picker/picker";

const FormData = require("form-data");

type PlantIdentificationRouteProp = RouteProp<
  RootStackParamList,
  "PlantIdentification"
>;

interface PlantIdentificationProps {
  route: PlantIdentificationRouteProp;
  navigation: any;
}

const PlantIdentification: React.FC<PlantIdentificationProps> = ({
  route,
  navigation,
}) => {
  const { photoUri, latPosition, longPosition } = route.params;
  const [organType, setOrganType] = useState("leaf");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = () => {
    setUploading(true);

    const formData = new FormData();

    formData.append("organs", `${organType}`);
    formData.append("images", {
      uri: photoUri,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    const project = "all";
    const includeRelatedImages = true;
    const noReject = false;
    const nbResults = 3;
    const lang = "en";
    const apiKey = "2b107NOh3HG5cNE31rCZUUj0u";
    const url = `https://my-api.plantnet.org/v2/identify/${project}?api-key=${apiKey}&include-related-images=${includeRelatedImages}&no-reject=${noReject}&nb-results=${nbResults}&lang=${lang}`;

    axios
      .post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const result = response.data;
        navigation.navigate("AiResult", {
          data: result,
          latPosition,
          longPosition,
          photoUri,
        });

        Alert.alert(
          "Plants Found",
          `Choose the plant that looks most like your image.`
        );
      })
      .catch((error) => {
        console.error("Error submitting plant identification:", error);
        Alert.alert(
          "Plant Not Found",
          "The AI could not find your plant. Please retake your image and resubmit"
        );
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.container}>
      {uploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>
            Awaiting AI identification results...
          </Text>
        </View>
      )}
      <Image source={{ uri: photoUri }} style={styles.preview} />
      <Text style={styles.label}>Select Organ Type:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={organType}
          style={styles.picker}
          onValueChange={(itemValue) => setOrganType(itemValue)}
        >
          <Picker.Item label="Leaf" value="leaf" />
          <Picker.Item label="Flower" value="flower" />
          <Picker.Item label="Fruit" value="fruit" />
          <Picker.Item label="Bark" value="bark" />
          <Picker.Item label="Other" value="auto" />
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { width: screenWidth * 0.8 }]}
          onPress={handleSubmit}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>Submit for Identification</Text>
        </TouchableOpacity>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 8,
    width: "80%",
  },
  picker: {
    height: 50,
    width: "100%",
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
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  retakePhotoButton: {
    backgroundColor: "#a5ccc0",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PlantIdentification;

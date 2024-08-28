import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Button,
  Text,
  Alert,
  ActivityIndicator,
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
          "We've found some matches",
          `Choose the wildlife you've sighted`
        );
      })
      .catch((error) => {
        console.error("Error submitting plant identification:", error);
        Alert.alert(
          "Error",
          "An error occurred while submitting the plant identification."
        );
      })
      .finally(() => {
        setUploading(false);
      });
  };

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
        <View style={styles.buttonWrapper}>
          <Button
            color="#215140"
            title="Submit for Identification"
            onPress={handleSubmit}
            disabled={uploading}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Retake Photo"
            color="#a5ccc0"
            onPress={() => navigation.navigate("Camera")}
          />
        </View>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    width: "80%",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  buttonContainer: {
    width: "80%",
    marginVertical: 20,
  },
  buttonWrapper: {
    marginVertical: 10,
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

import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text, Alert, ActivityIndicator } from "react-native";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import { RootStackParamList } from "../types";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";

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
  const [loading, isLoading] = useState(false)

  const handleSubmit = () => {
    isLoading(true)
    
    
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
  
        isLoading(false)
        const result = response.data;
        navigation.navigate("AiResult", {
          data: result,
          latPosition,
          longPosition,
          photoUri,
        });

        Alert.alert(
          "Plants Found",
          `Choose the plant that looks most like your image.`,

        );
        
      })
      .catch((error) => {
        console.error("Error submitting plant identification:", error);
        Alert.alert(
          "Plant Not Found",
          "The AI could not find your plant. Retake your image and resubmit"
        );
        navigation.navigate("Camera")

      })
      .finally(() => {
        setUploading(false);
        isLoading(false)
        
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>AI Loading...Finding Plants...</Text>
      </View>
    );
  
  }


  return (
    
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />
      <Text style={styles.label}>Select Organ Type:</Text>
      <Picker
        selectedValue={organType}
        style={styles.picker}
        onValueChange={(itemValue) => setOrganType(itemValue)}
      >
        <Picker.Item  label="Leaf" value="leaf" />
        <Picker.Item   label="Flower" value="flower" />
        <Picker.Item   label="Fruit" value="fruit" />
        <Picker.Item   label="Bark" value="bark" />
        <Picker.Item  label="Other" value="auto" />
      </Picker>
<View style={styles.buttonContainer}>
<TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Camera")}
      >
        <Text style={styles.text}> Retake Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={uploading}
      >
        <Text style={styles.text}>Submit</Text>
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
    backgroundColor: "white"
  },
  preview: {
    width: "100%",
    height: "50%",
    marginBottom: 20,
  },
  label: {
    fontSize: 24,
    marginBottom: 0,
  },buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  button: {
    width: 200,
    margin: 10,
    padding: 12,

    alignContent: "center",
    backgroundColor: '#215140',
    borderRadius: 8,
  },
  picker: {
    height: 150,
    width: 200,
    marginBottom: 20,
  
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center"

  },loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default PlantIdentification;

import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Button, Text, Alert } from "react-native";
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
      .post(
        url,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'}
        }
      )
      .then((response) => {
        const result = response.data;
        navigation.navigate('AiResult', {data: result, latPosition, longPosition, photoUri})

        Alert.alert(
          "We've found some matches",
          `Choose the wildlife you've sightedkmn`
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

//   if (setUploading) {
//     return <p> Getting Plant Info</p>
//   }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />
      <Text style={styles.label}>Select Organ Type:</Text>
      <Picker
        selectedValue={organType}
        style={styles.picker}
        onValueChange={(itemValue) => setOrganType(itemValue)}
      >
        <Picker.Item label="Leaf" value="leaf" />
        <Picker.Item label="Flower" value="flower" />
        <Picker.Item label="Fruit" value="fruit" />
        <Picker.Item label="Bark" value="bark" />
        <Picker.Item label="other" value="auto" />
      </Picker>
      <Button title="Submit" onPress={handleSubmit} disabled={uploading} />
      <Button
        title="Retake Photo"
        onPress={() => navigation.navigate("Camera")}
      />
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
    marginBottom: 10,
  },
  picker: {
    height: 150,
    width: 150,
    marginBottom: 20,
  },
});

export default PlantIdentification;

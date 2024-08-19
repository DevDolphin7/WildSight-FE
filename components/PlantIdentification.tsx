import React, { useState } from 'react';
import { View, Image, StyleSheet, Button, Text, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from '../types';
import { Picker } from '@react-native-picker/picker';

type PlantIdentificationRouteProp = RouteProp<RootStackParamList, 'PlantIdentification'>;

interface PlantIdentificationProps {
  route: PlantIdentificationRouteProp;
  navigation: any;
}

const PlantIdentification: React.FC<PlantIdentificationProps> = ({ route, navigation }) => {
  const { photoUri, latPosition, longPosition } = route.params;
  const [organType, setOrganType] = useState('leaf');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    setUploading(true);
    try {
      const response = await axios.post('backend url to idenfity plants', {
        imageUri: photoUri,
        organType,
        latitude: latPosition,
        longitude: longPosition,
      });
      const result = response.data;



      console.log('PlantNet response:', result);



      Alert.alert('Result', `Plant identification result: ${JSON.stringify(result)}`);


    } catch (error) {
      console.error('Error submitting plant identification:', error);
      Alert.alert('Error', 'An error occurred while submitting the plant identification.');
    } finally {
      setUploading(false);
    }
  };

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
      <Button title="Retake Photo" onPress={() => navigation.navigate('Camera')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
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

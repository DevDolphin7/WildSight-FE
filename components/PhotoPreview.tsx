import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Button, Alert, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; 

type PhotoPreviewRouteProp = RouteProp<RootStackParamList, 'PhotoPreview'>;
type PhotoPreviewNavigationProp = StackNavigationProp<RootStackParamList, 'PhotoPreview'>;

interface PhotoPreviewProps {
  route: PhotoPreviewRouteProp;
  navigation: PhotoPreviewNavigationProp;
}

const PhotoPreviewScreen: React.FC<PhotoPreviewProps> = ({ route, navigation }) => {
  const { photoUri, latPosition, longPosition } = route.params;
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean>(false);
  const [loading, isLoading] = useState(false)

  useEffect(() => {

    isLoading(true)
  
    MediaLibrary.requestPermissionsAsync().then(({ status }) => {
      setHasMediaLibraryPermission(status === 'granted');
    }).catch((err) => {
      console.error('Error requesting media library permissions:', err);
    });
    isLoading(false)
  }, []);

  const savePhoto = async () => {
    if (hasMediaLibraryPermission) {
      try {
        const asset = await MediaLibrary.createAssetAsync(photoUri);
        if (asset) {
          Alert.alert('Success', 'Photo saved to gallery!');
        } else {
          Alert.alert('Error', 'Failed to save photo.');
        }
      } catch (error) {
        console.error('Error saving photo:', error);
        Alert.alert('Error', 'An error occurred while saving the photo.');
      }
    } else {
      Alert.alert('Permission Denied', 'You need to grant media library permissions to save photos.');
    }
  };

  const handleUsePhoto = () => {
    navigation.navigate('PlantIdentification', {
      photoUri,
      latPosition,
      longPosition,
    });

    Alert.alert(
      "Choose an Organ Type",
      `This is the specific part of the plant. Choosing the correct part of the plant will improve the accuracy of the AI. `,
  
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );

    

  }


  return (
    <View style={styles.container}>

      <Image source={{ uri: photoUri }} style={styles.preview} />

      <View style={styles.buttonContainer}> 

        
        <TouchableOpacity style={styles.button} title="Retake Photo" onPress={() => navigation.navigate('Camera')}>
        <Text style={styles.text}>Retake Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} title="Use Photo" onPress={handleUsePhoto} >
          <Text style={styles.text}> Use Photo</Text>
        </TouchableOpacity>
    

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "white"

  },
  preview: {
    width: '100%',
    height: '50%',

  },
  buttonContainer: {
    
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",

  },
  button:{
    margin: 10,
    padding: 12,
    alignSelf: "flex-end",
    backgroundColor: '#215140',
    borderRadius: 8,

  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  }
});

export default PhotoPreviewScreen;

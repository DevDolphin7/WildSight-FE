import { Image, StyleSheet, Button, ImageBackground } from 'react-native';
import { NavigationContainer, RouteProp} from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; 

import CameraScreen from '@/components/CameraScreen';
import PhotoPreview from '@/components/PhotoPreview';
import PlantIdentification from '@/components/PlantIdentification';
import AiResult from '@/components/AiResult'


const backgroundImage = require("../../assets/images/icon.png")

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (

      <Stack.Navigator initialRouteName="Camera">
        <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Camera' }} />
        <Stack.Screen name="PhotoPreview" component={PhotoPreview} options={{ title: 'Photo Preview' }} />
        <Stack.Screen name="PlantIdentification" component={PlantIdentification} options={{ title: 'Photo Identification' }} />
        <Stack.Screen name="AiResult" component={AiResult} options={{ title: 'AiResult' }} />

      </Stack.Navigator>

  );
}



const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
  },
  background: {
    display: "flex",
    justifyContent: "space-around",
    height: "100%",
    width: "100%",
    alignItems: "center",
  }
});



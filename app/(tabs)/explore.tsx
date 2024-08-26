import { Image, StyleSheet, Button, ImageBackground } from 'react-native';
import { NavigationContainer, RouteProp} from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; 

import MyWildlife from '@/components/MyWiildlife';
import SingleSighting from '@/components/SingleSIghting';


const backgroundImage = require("../../assets/images/icon.png")

const Stack = createStackNavigator();

export default function WildLifeStack() {
  return (

      <Stack.Navigator initialRouteName='My Wildlife' >
        <Stack.Screen name="My Wildlife" component={MyWildlife} options={{ title: 'My Wildlife' }} />
        <Stack.Screen name="Single Sighting" component={SingleSighting} options={{ title: 'Single Sighting' }} />

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



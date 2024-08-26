import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { getSightingById } from '@/app/WildSight-api';
import { ScrollView } from 'react-native-gesture-handler';

type RootStackParamList = {
  SingleSighting: { sighting_id: string };
  // Other routes...
};

type SingleSightingNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SingleSighting'
>;

type SingleSightingRouteProp = RouteProp<
  RootStackParamList,
  'SingleSighting'
>;

type Props = {
  navigation: SingleSightingNavigationProp;
  route: SingleSightingRouteProp;
};



export default function SingleSighting() {
    const route = useRoute()

    const [favourite, setFavourite ] = useState({});
    const [liked, setLiked] = useState(0);

    useEffect(() => {
        getSightingById(1).then((response) => {
            setFavourite(response)
         
    
        });

    }, [favourite, liked])


    return (
        <ScrollView>
        <View style={styles.container}>
           
            <Text style={styles.title}> {favourite.common_name}</Text>
            <Image  style={styles.image} source={{uri: favourite.uploaded_image}}/>

            <Text> {favourite.sighting_date}</Text>
            <Text> {favourite.taxon_name}</Text>
            <Text> {favourite.wikipedia_url}</Text>



        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    image: {
        width: 400,
        height: 400,
        borderWidth: 1,
        borderRadius: 8
    },
    title: {
        fontSize: 22,
		fontWeight: "bold",
    }

})
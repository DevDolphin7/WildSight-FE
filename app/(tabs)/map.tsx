import { StyleSheet, Image, Platform } from 'react-native';

export default function Map() {
  return (
    <h1>Hello from map</h1>
      
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

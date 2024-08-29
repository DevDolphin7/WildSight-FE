import { Text, View, Image, StyleSheet } from "react-native";

const plantNetLogo = require("../assets/images/Pl@ntNetLogo.png");
const iNaturalistLogo = require("../assets/images/iNaturalistLogo.png")
const googleMapsLogo = require("../assets/images/GoogleMapsLogo.png")
const appleMapsLogo = require("../assets/images/AppleMapsLogo.png")


export default function PoweredBy() {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>Powered by</Text>
      <Image source={plantNetLogo} style={styles.image} />
      <Image source={iNaturalistLogo} style={styles.image} />
      <Image source={googleMapsLogo} style={{...styles.image, height: 100}} />
      <Image source={appleMapsLogo} style={{...styles.image, height: 50}} />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: "80%",
    height: "80%",
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    color: "#232325",
    fontSize: 32,
    marginBottom: 5,
  },
  image: {
    width: 250,
    height: 70,
    resizeMode: "contain",
    marginBottom: 10,
  },
});

import { Image, StyleSheet, Button, ImageBackground } from 'react-native';


const backgroundImage = require("../../assets/images/icon.png")

export default function HomeScreen() {

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
          />
          <Button title="Get Started"></Button>
          </ImageBackground>
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

import { useState } from "react";
import { ImageBackground, StyleSheet, Modal, Button } from "react-native";
import HomeScreen from "@/components/HomeScreen";
import SignUp from "@/components/SignUp";
const backgroundImage = require("../../assets/images/home-screen-background.png");

export default function Index() {
  const [signUpOpen, setSignUpOpen] = useState(false);
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <Modal visible={signUpOpen} animationType="slide">
        <Button
          title="close"
          onPress={() => {
            setSignUpOpen(false);
          }}
        />
        <SignUp />
      </Modal>
      <HomeScreen setSignUpOpen={setSignUpOpen} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

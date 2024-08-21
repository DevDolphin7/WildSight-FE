import { useRef } from "react";
import { ImageBackground, View, Image, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PagerView from "react-native-pager-view";
import BackgroundImage from "../assets/images/home-screen-background.png";

export default function HomeScreen() {
  const ref = useRef<PagerView>(null);
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={BackgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <PagerView style={styles.background} initialPage={0} ref={ref}>
        <View style={styles.background} key="1">
          <View style={styles.page}>
            <Image
              source={require("@/assets/images/partial-react-logo.png")}
              style={styles.reactLogo}
            />
            <Button
              title="SignUp"
              onPress={() => {
                navigation.navigate("SignUp");
              }}
            ></Button>
            <Button
              title="Get Started ->"
              onPress={() => {
                ref.current?.setPage(1);
              }}
            ></Button>
          </View>
        </View>
        <View style={styles.background} key="2">
          <View style={styles.page}>
            <Button
              title="<- Page 2 ->"
              onPress={() => {
                ref.current?.setPage(2);
              }}
            ></Button>
          </View>
        </View>
        <View style={styles.background} key="3">
          <View style={styles.page}>
            <Button
              title="<- Go Back ->"
              onPress={() => {
                ref.current?.setPage(0);
              }}
            ></Button>
          </View>
        </View>
      </PagerView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  page: {
    width: "90%",
    height: "60%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 20,
    borderColor: "#21514080",
    backgroundColor: "#ffd5bd80",
  },
});

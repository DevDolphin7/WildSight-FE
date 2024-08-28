import { FlatList, View, Text, StyleSheet } from "react-native";

interface ContentItem {
  key: String;
  content: String;
}

interface GuidanceType {
  [x: string]: any;
  username: ContentItem[];
  email: ContentItem[];
  password: ContentItem[];
}

const validationGuidance: GuidanceType = {
  username: [
    {
      key: "1",
      content: " - At least 3 characters",
    },
    {
      key: "2",
      content: " - No spaces",
    },
    {
      key: "3",
      content: " - No symbols other than a dash -",
    },
  ],
  email: [
    {
      key: "1",
      content: " - A valid email address",
    },
  ],
  password: [
    {
      key: "1",
      content: " - Between 8 and 24 characters",
    },
    {
      key: "2",
      content: " - At least 1 number",
    },
    {
      key: "3",
      content: " - At least 1 captial letter",
    },
    {
      key: "4",
      content: " - At least 1 lower case letter",
    },
    {
      key: "5",
      content: " - At least 1 of the following symbols: @#$%^&+=",
    },
  ],
};

export default function FormGuidance({ guidance }: any) {
  const renderItem = ({ item }: { item: { content: string } }) => (
    <Text>{item.content}</Text>
  );
  return (
    <View style={styles.popup}>
      <Text>Must contain:</Text>
      <FlatList
        data={validationGuidance[guidance]}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.key}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  popup: {
    flex: 1,
    width: "80%",
    height: "auto",
    position: "absolute",
    zIndex: 1,
    top: 65,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 3,
    borderRadius: 20,
    borderColor: "#21514080",
    backgroundColor: "#ffd5bd",
  },
});

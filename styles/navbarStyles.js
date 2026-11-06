import { StyleSheet } from "react-native";

const navbarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: 16,
    backgroundColor: "#333",
  },
  group: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  link: {
    color: "white",
    marginRight: 16,
  },
});

export default navbarStyles;
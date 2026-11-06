import { StyleSheet } from "react-native";

const navbarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    padding: 16,
    backgroundColor: "#333333",
  },
  group: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  link: {
    color: "#FFFFFF",
    marginRight: 16,
    fontWeight: "500",
  },
});

export default navbarStyles;

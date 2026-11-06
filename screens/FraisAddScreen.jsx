import { View, StyleSheet } from "react-native";
import FraisForm from "../components/FraisForm";
import Navbar from "../components/Navbar";

export default function FraisAddScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.screen}>
        <FraisForm />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#F4F5F9" },
});

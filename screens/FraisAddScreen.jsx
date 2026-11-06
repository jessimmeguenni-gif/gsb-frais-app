import { View, StyleSheet } from "react-native";
import FraisForm from "../components/FraisForm";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { addFrais } from "../services/fraisService";

export default function FraisAddScreen({ navigation }) {
  const { user, token } = useAuth();

  // Appelée par FraisForm avec les valeurs saisies.
  async function handleAdd(values) {
    await addFrais({ ...values, id_visiteur: user.id_visiteur }, token);
    navigation.navigate("Dashboard");
  }

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.screen}>
        <FraisForm onSubmit={handleAdd} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#F4F5F9" },
});

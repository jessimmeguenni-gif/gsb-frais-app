import { View, Text, StyleSheet } from "react-native";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenue sur GSB Frais</Text>
        {user ? (
          <Text style={styles.text}>Bonjour {user?.prenom_visiteur} !</Text>
        ) : (
          <Text style={styles.text}>Connectez-vous pour consulter vos notes de frais.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12, color: "#161B33" },
  text: { fontSize: 16, color: "#5B6270" },
});

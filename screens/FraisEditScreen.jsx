import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import FraisForm from "../components/FraisForm";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getFrais, updateFrais } from "../services/fraisService";

export default function FraisEditScreen({ navigation, route }) {
  const { id } = route.params; // id passé par navigation.navigate("FraisEdit", { id })
  const { token } = useAuth();
  const [frais, setFrais] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Récupération du frais à modifier
  useEffect(() => {
    const fetchFrais = async () => {
      try {
        setFrais(await getFrais(id, token));
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFrais();
  }, [id, token]);

  // Appelée par FraisForm : on fusionne les valeurs saisies avec les champs non modifiables
  async function handleUpdate(values) {
    await updateFrais(
      {
        id_frais: frais.id_frais,
        id_visiteur: frais.id_visiteur,
        id_etat: frais.id_etat, // Conserver l'état actuel
        montantvalide: frais.montantvalide,
        ...values,
      },
      token
    );
    navigation.navigate("Dashboard");
  }

  let content;
  if (loading) {
    content = <ActivityIndicator size="large" />;
  } else if (!frais) {
    content = <Text>{error || "Frais non trouvé"}</Text>;
  } else {
    content = <FraisForm frais={frais} onSubmit={handleUpdate} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.screen}>{content}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#F4F5F9" },
});

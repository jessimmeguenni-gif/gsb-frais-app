import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";
import FraisForm from "../components/FraisForm";
import Navbar from "../components/Navbar";

// Écran intermédiaire : récupère le frais à modifier puis le transmet à FraisForm
export default function FraisEditScreen() {
  const route = useRoute();
  const { id } = route.params; // id passé en paramètre de navigate()
  const [frais, setFrais] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFrais = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await fetch(`${API_URL}frais/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || `Erreur HTTP ${response.status}`);
        }
        setFrais(await response.json());
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFrais();
  }, [id]);

  let content;
  if (loading) content = <ActivityIndicator size="large" />;
  else if (!frais) content = <Text>Frais non trouvé</Text>;
  else content = <FraisForm frais={frais} />;

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

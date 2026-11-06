import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Switch,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import FraisCard from "../components/FraisCard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";

export default function DashboardScreen({ navigation }) {
  const { user, token } = useAuth();

  // États
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNonNull, setFilterNonNull] = useState(true);
  const [minMontant, setMinMontant] = useState("");

  // Rechargement de la liste à CHAQUE retour sur l'écran (après un ajout ou une modification)
  useFocusEffect(
    useCallback(() => {
      const fetchFrais = async () => {
        try {
          const response = await fetch(`${API_URL}frais/liste/${user.id_visiteur}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setFraisList(data);
          setLoading(false);
        } catch (error) {
          console.error("Erreur lors de la récupération des frais :", error);
          setLoading(false);
        }
      };
      fetchFrais();
    }, [user, token])
  );

  // Filtres chaînés :
  // 1. montant validé non nul (si le Switch est activé)
  // 2. recherche sur année-mois OU id visiteur
  // 3. montant validé supérieur au montant saisi (si un montant est saisi)
  const seuil = parseFloat(minMontant.replace(",", "."));
  const filteredFrais = fraisList
    .filter((f) => !filterNonNull || f.montantvalide !== null)
    .filter(
      (frais) =>
        frais.anneemois.includes(searchTerm) ||
        String(frais.id_visiteur).includes(searchTerm)
    )
    .filter((f) => isNaN(seuil) || (f.montantvalide !== null && parseFloat(f.montantvalide) > seuil));

  // Ouverture du formulaire de modification : on ne transmet que l'id
  function handleEdit(id) {
    navigation.navigate("FraisEdit", { id });
  }

  // Suppression côté API puis dans la liste affichée
  async function deleteFrais(id) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}frais/suppr`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id_frais: id }),
      });
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
      setFraisList((prev) => prev.filter((f) => f.id_frais !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  }

  // Confirmation avant suppression (Alert sur mobile, window.confirm sur le web)
  const handleDelete = (id) => {
    const message = "Êtes-vous sûr de vouloir supprimer cette note de frais ?";
    if (Platform.OS === "web") {
      if (window.confirm(message)) deleteFrais(id);
      return;
    }
    Alert.alert("Confirmation", message, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => deleteFrais(id) },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Tableau de bord de {user?.prenom_visiteur}</Text>

          <TextInput
            placeholder="Rechercher par année-mois ou ID visiteur..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />

          <View style={styles.filterRow}>
            <Switch value={filterNonNull} onValueChange={setFilterNonNull} />
            <Text style={styles.filterText}>Afficher seulement les frais avec un montant validé</Text>
          </View>

          <TextInput
            placeholder="Montant validé minimum (€)"
            keyboardType="numeric"
            value={minMontant}
            onChangeText={setMinMontant}
            style={styles.searchInput}
          />

          <FlatList
            data={filteredFrais}
            keyExtractor={(item) => String(item.id_frais)}
            renderItem={({ item }) => (
              <FraisCard frais={item} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F4F5F9" },
  title: { fontSize: 20, fontWeight: "bold", color: "#161B33", marginBottom: 12 },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
  },
  filterText: { flex: 1, marginLeft: 8, color: "#161B33" },
});

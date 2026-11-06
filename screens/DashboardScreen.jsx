import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
import { getFraisList, deleteFrais } from "../services/fraisService";

export default function DashboardScreen({ navigation }) {
  const { user, token } = useAuth();

  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNonNull, setFilterNonNull] = useState(true);
  const [minMontant, setMinMontant] = useState("");
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchFrais = async () => {
        try {
          setFraisList(await getFraisList(user.id_visiteur, token));
          setError("");
        } catch (err) {
          console.error("Erreur lors de la récupération des frais :", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchFrais();
    }, [user, token])
  );

  const seuil = parseFloat(minMontant);
  const filteredFrais = fraisList
    .filter((f) => !filterNonNull || f.montantvalide !== null)
    .filter(
      (frais) =>
        String(frais.anneemois).includes(searchTerm) ||
        String(frais.id_visiteur).includes(searchTerm)
    )
    .filter((f) => isNaN(seuil) || (f.montantvalide !== null && parseFloat(f.montantvalide) > seuil));

  // Ouverture du formulaire de modification
  function handleEdit(id) {
    navigation.navigate("FraisEdit", { id });
  }

  async function removeFrais(id) {
    try {
      await deleteFrais(id, token);
      setFraisList((prev) => prev.filter((f) => f.id_frais !== id));
    } catch (error) {
      Alert.alert("Erreur lors de la suppression :", error.message);
    }
  }

  const handleDelete = (id) => {
    const message = "Êtes-vous sûr de vouloir supprimer cette note de frais ?";
    if (Platform.OS === "web") {
      if (window.confirm(message)) removeFrais(id);
      return;
    }
    Alert.alert("Confirmation", message, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => removeFrais(id) },
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

          {error ? <Text style={styles.error}>{error}</Text> : null}

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
  error: { color: "red", marginBottom: 12 },
});

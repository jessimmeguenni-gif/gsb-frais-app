import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Switch,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import FraisCard from "../components/FraisCard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../services/authService";

export default function DashboardScreen() {
  const { user, token } = useAuth();

  // États
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNonNull, setFilterNonNull] = useState(true);
  const [minMontant, setMinMontant] = useState("");

  // Récupération des frais du visiteur connecté depuis l'API (route sécurisée par le token)
  useEffect(() => {
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
  }, []);

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
            renderItem={({ item }) => <FraisCard frais={item} />}
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

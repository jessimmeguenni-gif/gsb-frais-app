import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";
import { fraisFormStyles as styles } from "../styles/fraisFormStyles";

// Formulaire partagé : ajout (frais = null) ET modification (frais fourni)
export default function FraisForm({ frais = null }) {
  const navigation = useNavigation();

  // États locaux
  const [idFrais, setIdFrais] = useState(null);
  const [anneeMois, setAnneeMois] = useState("");
  const [nbJustificatifs, setNbJustificatifs] = useState("");
  const [montant, setMontant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mode modification : on préremplit le formulaire à chaque changement de la prop frais
  useEffect(() => {
    if (frais) {
      setIdFrais(frais.id_frais);
      setMontant(frais.montantvalide || "");
      setAnneeMois(frais.anneemois || "");
      setNbJustificatifs(String(frais.nbjustificatifs ?? ""));
    }
  }, [frais]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token manquant");

      const user = JSON.parse(await AsyncStorage.getItem("user"));
      const fraisData = {
        anneemois: anneeMois,
        id_visiteur: user.id_visiteur,
        nbjustificatifs: parseInt(nbJustificatifs, 10),
      };

      let url;
      if (frais) {
        // Modification (UPDATE)
        fraisData.id_frais = idFrais;
        fraisData.montantvalide = parseFloat(montant);
        fraisData.id_etat = frais.id_etat; // on conserve l'état du frais enregistré
        url = `${API_URL}frais/modif`;
      } else {
        // Ajout (CREATE)
        url = `${API_URL}frais/ajout`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(fraisData),
      });

      // response.ok vaut true si le code http est entre 200 et 299 (succès)
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Erreur HTTP ${response.status}`);
      }

      navigation.navigate("Dashboard");
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{frais ? "Modifier la note de frais" : "Saisir une note de frais"}</Text>

      <View>
        <Text>Année-mois :</Text>
        <TextInput
          style={styles.input}
          placeholder="Année-mois (ex: 2023-10)"
          value={anneeMois}
          onChangeText={setAnneeMois}
        />
      </View>

      <View>
        <Text>Nombre de justificatifs :</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de justificatifs"
          keyboardType="numeric"
          value={nbJustificatifs}
          onChangeText={setNbJustificatifs}
        />
      </View>

      <View>
        <Text>Montant saisi :</Text>
        <TextInput
          editable={false}
          selectOnFocus={false}
          style={[styles.input, { backgroundColor: "#f0f0f0" }]}
          keyboardType="numeric"
          value={String(montant)}
          onChangeText={setMontant}
        />
      </View>

      <View style={styles.smallButtonRow}>
        <Pressable style={[styles.smallbutton, styles.buttonDisabled]} disabled={loading}>
          <Text style={styles.buttonText}>Frais hors forfait</Text>
        </Pressable>
        <Pressable style={[styles.smallbutton, styles.buttonDisabled]} disabled={loading}>
          <Text style={styles.buttonText}>Frais au forfait</Text>
        </Pressable>
      </View>

      {error ? <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text> : null}

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Enregistrement..." : frais ? "Mettre à jour" : "Ajouter"}
        </Text>
      </Pressable>
    </View>
  );
}

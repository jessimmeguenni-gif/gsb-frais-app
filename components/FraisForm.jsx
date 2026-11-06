import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fraisFormStyles as styles } from "../styles/fraisFormStyles.js";

export default function FraisForm({ frais = null, onSubmit }) {
  // Utilisé uniquement pour les boutons frais hors forfait / au forfait (pas encore implémentés)
  const navigation = useNavigation();

  // États locaux du formulaire
  const [anneeMois, setAnneeMois] = useState("");
  const [nbJustificatifs, setNbJustificatifs] = useState("");
  const [montant, setMontant] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // En mode modification, on préremplit les champs avec le frais reçu
  useEffect(() => {
    if (frais) {
      setAnneeMois(frais.anneemois || "");
      setNbJustificatifs(String(frais.nbjustificatifs || ""));
      // Plus tard, on calculera ici le montant saisi à partir des montants des différents frais
    }
  }, [frais]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await onSubmit({
        anneemois: anneeMois,
        nbjustificatifs: parseInt(nbJustificatifs, 10),
      });
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message || "Erreur lors de l’enregistrement");
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
          value={montant}
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

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Enregistrement..." : frais ? "Mettre à jour" : "Ajouter"}
        </Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

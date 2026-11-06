import { View, Text, Pressable, StyleSheet } from "react-native";

// La carte ne fait qu'afficher : les actions (onEdit, onDelete) sont fournies par le parent Dashboard
export default function FraisCard({ frais, onEdit, onDelete }) {
  const montantValide =
    frais.montantvalide !== null && frais.montantvalide !== undefined
      ? `${parseFloat(frais.montantvalide).toFixed(2)} €`
      : "non validé";

  return (
    <View style={styles.card}>
      {/* Infos prioritaires : quelle note, quel mois, combien */}
      <Text style={styles.title}>
        Note [{frais.id_frais}] Visiteur n°{frais.id_visiteur} - {frais.anneemois}
      </Text>
      <Text style={styles.montant}>Montant validé : {montantValide}</Text>
      {/* Infos secondaires : plus petites, couleur discrète */}
      <Text style={styles.meta}>
        État : {frais.lib_etat ?? frais.id_etat} · Justificatifs : {frais.nbjustificatifs}
      </Text>
      <Text style={styles.meta}>Modifiée le : {frais.datemodification}</Text>
      <Text style={styles.meta}>Montant saisi : —</Text>

      <View style={styles.buttonRow}>
        <Pressable onPress={() => onEdit(frais.id_frais)} style={styles.editButton}>
          <Text style={styles.editText}>Modifier</Text>
        </Pressable>
        <Pressable onPress={() => onDelete(frais.id_frais)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Supprimer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#161B33",
  },
  meta: {
    fontSize: 14,
    color: "#5B6270",
    marginTop: 4,
  },
  montant: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0E8C7C",
    marginTop: 4,
  },
  buttonRow: { flexDirection: "row", marginTop: 12 },
  editButton: {
    backgroundColor: "#E8EAF0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  editText: { color: "#161B33", fontWeight: "600" },
  deleteButton: {
    backgroundColor: "#FDE8E8",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  deleteText: { color: "#C0392B", fontWeight: "600" },
});

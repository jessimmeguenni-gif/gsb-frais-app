import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { View, Text, TextInput, Pressable } from "react-native";
import Navbar from "../components/Navbar";
import { loginStyles as styles } from "../styles/loginStyles.js";

export default function LoginScreen() {
  // 1. États locaux pour les champs du formulaire
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 2. Récupération de la fonction loginUser depuis le contexte d'authentification
  const { loginUser } = useAuth();

  // 3. Soumission du formulaire : PAS de navigation.navigate() ici.
  // C'est le changement de user dans le contexte qui fait basculer AppNavigator
  // sur le groupe "connecte" (et donc sur Dashboard).
  const handleSubmit = async () => {
    setSubmitting(true); // Indique que la soumission est en cours
    setError(""); // Réinitialise l'erreur avant de tenter la connexion
    try {
      await loginUser(login, password);
    } catch (e) {
      setError(e.message); // Affiche l'erreur à l'utilisateur
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Rendu du formulaire de connexion
  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.container}>
        <Text style={styles.title}>Connexion</Text>
        <View>
          <Text>Login :</Text>
          <TextInput
            style={styles.input}
            value={login}
            autoCapitalize="none"
            onChangeText={setLogin}
          />
        </View>

        <View>
          <Text>Mot de passe :</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Pressable style={styles.button} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? "Connexion..." : "Se connecter"}</Text>
        </Pressable>
        {error ? <Text style={{ color: "red", marginTop: 12 }}>{error}</Text> : null}
      </View>
    </View>
  );
}

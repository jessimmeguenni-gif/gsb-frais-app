import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import Navbar from "../components/Navbar";
import { loginStyles } from "../styles/loginStyles";

export default function LoginScreen() {
  // 1. États locaux pour les champs du formulaire
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  // 2. Récupération de loginUser depuis le contexte
  const { loginUser } = useAuth();

  // 3. Hook pour la redirection après connexion
  const navigation = useNavigation();

  // 4. Déclaration de la fonction handleSubmit
 const handleSubmit = () => {
  if (!loginUser(login, password)) {
    Alert.alert("Identifiants incorrects");
  }
};
  // 5. Rend le formulaire
  return (
    <View style={styles.screen}>
      <Navbar />
      <View style={styles.container}>
        <Text style={styles.title}>Connexion</Text>
        <View>
          <Text>Login :</Text>
          <TextInput
            style={styles.input}
            value={login}
            onChangeText={setLogin}
          />
        </View>
        <View>
          <Text>Password :</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#333333",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "bold" },
});

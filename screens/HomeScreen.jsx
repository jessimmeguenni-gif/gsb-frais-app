import { View, Text } from "react-native";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View>
      <Navbar />
      <Text>Bienvenue</Text>
      {/* ?. évite une erreur si user vaut encore null */}
      {user && <Text>Bonjour {user?.prenom_visiteur} !</Text>}
    </View>
  );
}

import { View, Text } from "react-native";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <View>
      <Navbar />
      <Text>Tableau de bord de {user}</Text>
    </View>
  );
}
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import navbarStyles from "../styles/navbarStyles";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigation = useNavigation();
  const { user, logoutUser } = useAuth();

  return (
    <View style={navbarStyles.container}>
      <View style={navbarStyles.group}>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Text style={navbarStyles.link}>Accueil</Text>
        </Pressable>

        {user && (
          <Pressable onPress={() => navigation.navigate("Dashboard")}>
            <Text style={navbarStyles.link}>Tableau de bord</Text>
          </Pressable>
        )}
      </View>

      <View style={navbarStyles.group}>
        {user ? (
          <Pressable onPress={logoutUser}>
            <Text style={navbarStyles.link}>Déconnexion</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={navbarStyles.link}>Connexion</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default Navbar;
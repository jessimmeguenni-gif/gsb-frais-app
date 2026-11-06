import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import navbarStyles from "../styles/navbarStyles";

function Navbar() {
  // Navbar n'est pas un écran : pas de prop navigation, on utilise le hook
  const navigation = useNavigation();
  const { user, logoutUser } = useAuth();

  return (
    <View style={navbarStyles.container}>
      <View style={navbarStyles.group}>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Text style={navbarStyles.link}>Accueil</Text>
        </Pressable>
        {/* Rendu conditionnel : liens réservés aux utilisateurs connectés */}
        {user && (
          <>
            <Pressable onPress={() => navigation.navigate("Dashboard")}>
              <Text style={navbarStyles.link}>Tableau de bord</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate("FraisAdd")}>
              <Text style={navbarStyles.link}>Proposer un frais</Text>
            </Pressable>
          </>
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

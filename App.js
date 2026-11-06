import { View, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import FraisAddScreen from "./screens/FraisAddScreen";
import FraisEditScreen from "./screens/FraisEditScreen";

const Stack = createNativeStackNavigator();

// Composant séparé : il est rendu À L'INTÉRIEUR de AuthProvider,
// donc useAuth() y a bien accès au contexte.
function AppNavigator() {
  const { user, sessionLoading } = useAuth();

  // Pendant la lecture d'AsyncStorage, on ne décide pas encore Login / Dashboard
  if (sessionLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {/* navigationKey : quand on change de groupe (connexion / déconnexion),
          la pile est vidée et on démarre sur le 1er écran du nouveau groupe */}
      {user ? (
        <Stack.Group navigationKey="connecte">
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Tableau de bord" }} />
          <Stack.Screen name="FraisAdd" component={FraisAddScreen} options={{ title: "Nouvelle note" }} />
          <Stack.Screen name="FraisEdit" component={FraisEditScreen} options={{ title: "Modifier la note" }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Accueil" }} />
        </Stack.Group>
      ) : (
        <Stack.Group navigationKey="invite">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Accueil" }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Connexion" }} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}

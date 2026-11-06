import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import FraisAddScreen from "./screens/FraisAddScreen";
import FraisEditScreen from "./screens/FraisEditScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, sessionLoading } = useAuth();

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
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="FraisAdd" component={FraisAddScreen} />
          <Stack.Screen name="FraisEdit" component={FraisEditScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group navigationKey="invite">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
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
      </NavigationContainer>
    </AuthProvider>
  );
}

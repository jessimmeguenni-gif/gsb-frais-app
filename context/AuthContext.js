import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signIn, signOut } from "../services/authService";

// 1. Création du contexte
const AuthContext = createContext();

// 2. Fournisseur du contexte (AuthProvider)
export function AuthProvider({ children }) {
  // États : utilisateur connecté (null = non connecté), token, chargement de la session
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Restauration de la session au lancement de l'app (une seule fois au montage)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = await getCurrentUser();
        const storedToken = await getAuthToken();
        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Erreur lors de la restauration de session : ", error);
      } finally {
        setSessionLoading(false);
      }
    };
    restoreSession();
  }, []);

  // 3. Fonction de connexion (appel réel à l'API)
  async function loginUser(login, password) {
    let data;
    try {
      data = await signIn(login, password);
    } catch (e) {
      throw new Error("Impossible de joindre le serveur : vérifiez votre connexion internet.");
    }
    // Si l'API ne renvoie pas de token, la connexion a échoué : on lève une erreur
    // (attrapée par le catch de LoginScreen qui affiche le message)
    if (!data.token) {
      throw new Error(data.error || "Identifiants incorrects");
    }
    setUser(data.visiteur);
    setToken(data.token);
    return data;
  }

  // 4. Fonction de déconnexion
  const logoutUser = async () => {
    await signOut();
    setUser(null);
    setToken(null);
  };

  // 5. Valeurs exposées aux composants enfants
  return (
    <AuthContext.Provider value={{ user, token, sessionLoading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 6. Hook personnalisé pour utiliser le contexte facilement
export function useAuth() {
  return useContext(AuthContext);
}

// Lecture de l'utilisateur stocké (objet JS) ou null
export const getCurrentUser = async () => {
  const raw = await AsyncStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

// Lecture du token stocké (déjà une chaîne) ou null
export const getAuthToken = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? token : null;
};

import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "http://gsbfrais.julliand.ispconfig.lmdsio.com/api/";

// Connexion : envoie login/pwd à l'API, stocke user + token si succès
export async function signIn(login, pwd) {
  const response = await fetch(`${API_URL}visiteur/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, pwd }),
  });
  const data = await response.json();

  if (data.token) {
    await AsyncStorage.setItem("user", JSON.stringify(data.visiteur));
    await AsyncStorage.setItem("token", data.token);
  }
  return data;
}

// Déconnexion : supprime user et token d'AsyncStorage
export async function signOut() {
  await AsyncStorage.removeItem("user");
  await AsyncStorage.removeItem("token");
}

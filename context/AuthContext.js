import { createContext, useContext, useState } from "react";

// 1. Création du contexte
const AuthContext = createContext();
// 2. Fournisseur du contexte (AuthProvider)
export function AuthProvider({ children }) {
    // État local pour stocker l’utilisateur (null = non connecté)
    // ToDo : affecter la valeur nulle
    const [user, setUser] = useState(null);
    // 3. Fonction de connexion
    const loginUser = (login, password) => {
        // ToDo : implémenter une connexion avec une logique simplifiée : vérifie
        if (login === "Andre" && password === "secret") {
            setUser(login);
            return true;
        }
        return false;


    };
    // si login/mot de passe correspondent à des valeurs prédéfinies
    // Si le login vaut "Andre" et le mot de passe vaut "secret"
    // alors mettre à jour l’état avec le login de l’utilisateur connecté en utilisant setUser(login) puis renvoyer true
    // Si la connexion échoue, renvoyer false
    // 4. Fonction de déconnexion
    const logoutUser = () => {
        // ToDo : réinitialiser la valeur de l’état à null
        setUser(null);
    };
    // 5. Valeurs exposées aux composants enfants et rendu des composants enfants avec {children}
    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// 6. Hook personnalisé pour utiliser le contexte facilement
export function useAuth() {
    return useContext(AuthContext);
}
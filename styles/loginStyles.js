import { StyleSheet } from "react-native";
export const loginStyles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 24 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
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
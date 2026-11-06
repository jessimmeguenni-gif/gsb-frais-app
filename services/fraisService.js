import { API_URL } from "../config.js";

// Fonction commune à tous les appels de l'API frais :
// ajoute le token, lit la réponse JSON et transforme les erreurs HTTP en exceptions
async function request(endpoint, token, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    throw new Error("Impossible de joindre le serveur : vérifiez votre connexion internet.");
  }

  // Certaines réponses n'ont pas de corps JSON : on renvoie null au lieu de planter
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Erreur HTTP ${response.status}`);
  }
  return data;
}

export function getFraisList(idVisiteur, token) {
  return request(`frais/liste/${idVisiteur}`, token);
}

export function getFrais(idFrais, token) {
  return request(`frais/${idFrais}`, token);
}

export function addFrais(frais, token) {
  return request("frais/ajout", token, {
    method: "POST",
    body: JSON.stringify(frais),
  });
}

export function updateFrais(frais, token) {
  return request("frais/modif", token, {
    method: "POST",
    body: JSON.stringify(frais),
  });
}

export function deleteFrais(idFrais, token) {
  return request("frais/suppr", token, {
    method: "DELETE",
    body: JSON.stringify({ id_frais: idFrais }),
  });
}

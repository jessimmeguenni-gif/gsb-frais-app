# Compte-rendu — AP React Native GSB Frais, partie 5

## Partie 5.1 : Résolution de bug

### Étape 1 : Observer le bug

**1. Écrans déclarés selon `user`**
- Quand `user` vaut `null` : `Home` et `Login`.
- Quand `user` contient un utilisateur connecté : `Home`, `Dashboard`, `FraisAdd` et `FraisEdit`.

**2. Quel écran s'affiche après la connexion ?**
L'écran `Home`. Au moment de la connexion, la pile contient `Home → Login`. `Login` n'est plus déclaré, donc React Navigation le retire de la pile. Il reste l'écran en dessous, `Home`. Comme `Home` existe dans les deux états (sans clé qui les différencie), React Navigation considère que c'est le même écran et le garde. Rien ne lui demande d'aller sur `Dashboard`.

**3. Erreur avec `navigation.navigate("Dashboard")` dans `handleSubmit`**
On obtient : *« The action 'NAVIGATE' with payload {"name":"Dashboard"} was not handled by any navigator. Do you have a screen named 'Dashboard'? »*. Quand `navigate` s'exécute, le rendu n'a pas encore été refait avec le nouveau `user`. `Dashboard` n'est donc pas encore déclaré dans le navigator.

### Étape 3 : Après la correction

**1. Pourquoi `Home` est-il déclaré dans les deux groupes ?**
Chaque groupe a sa propre `navigationKey`. Pour que l'accueil soit accessible dans les deux états, il doit faire partie de chaque groupe. S'il était déclaré une seule fois avant la condition, il serait commun aux deux états : il resterait dans la pile au changement d'état, et on retomberait dans le bug (on resterait sur `Home` après la connexion).

**2. Expérience sans `navigationKey`**
Sans les clés, après la connexion, on reste sur `Home` au lieu d'arriver sur `Dashboard` : c'est le bug de départ. La clé identifie le groupe. Quand elle change (`invite` → `connecte`), React Navigation considère que les écrans ont changé : il vide la pile et repart du premier écran du nouveau groupe.

**3. Pourquoi `Dashboard` est-il déclaré en premier dans le groupe « connecte » ?**
Quand la pile est réinitialisée, on démarre sur le **premier écran déclaré** du groupe. Après la connexion, on veut arriver directement sur le tableau de bord, et le bouton retour ne doit pas ramener à `Login`.

**4. Un utilisateur non connecté peut-il atteindre `FraisAdd` ? Est-ce suffisant pour protéger les données ?**
Non, il ne peut pas : `FraisAdd` n'est pas déclaré quand `user` vaut `null`, donc la navigation vers cet écran est impossible. Mais ce n'est **pas suffisant** pour protéger les données, car c'est une protection côté client seulement. N'importe qui peut appeler l'API directement (Postman, curl...) sans passer par l'application. La vraie protection se fait **côté serveur** : les routes de l'API sont sécurisées par le token Bearer, et l'API doit vérifier que le visiteur ne lit ou ne modifie que **ses propres** notes de frais.

---

## Partie 5.2 : Refactoring

**1. Pourquoi `FraisForm` n'a-t-il plus besoin de savoir s'il s'agit d'un ajout ou d'une modification ?**
Il ne fait plus que la saisie. Il remonte les valeurs saisies (`anneemois`, `nbjustificatifs`) à la fonction `onSubmit` reçue en prop. C'est l'écran parent qui sait quoi en faire : `FraisAddScreen` passe `handleAdd` (appel à `addFrais`) et `FraisEditScreen` passe `handleUpdate` (appel à `updateFrais`). Le `if (frais) … else …` disparaît. Le formulaire utilise encore `frais` seulement pour préremplir les champs et adapter les textes.

**2. Que se passerait-il sans `try / catch` dans `handleSubmit` si le service échouait ?**
L'exception levée par `request()` (ex. `Erreur HTTP 400`) ne serait attrapée par personne. On aurait une *promise rejetée non gérée* : un avertissement rouge en développement, et rien de visible pour l'utilisateur. `setError` ne serait jamais appelé, donc aucun message ne s'afficherait sous le bouton. Et `setLoading(false)` ne serait jamais exécuté (pas de `finally`) : le bouton resterait bloqué sur « Enregistrement... ».

---

## Partie 5.3 : Mise en production

### Étape 1 : `app.json`

**1. À quoi sert `android.package` ?**
C'est l'identifiant unique de l'application sur Android (ex. `com.meguennitani.gsbfrais`), un peu comme un nom de domaine. Le système s'en sert pour identifier l'app, ses données et ses mises à jour. Deux applications ne peuvent pas avoir le même identifiant sur un même téléphone. Si on installe une app avec un identifiant déjà présent, Android la traite comme une **mise à jour** de l'app existante. Si la signature est différente, l'installation est **refusée**.

**2. Pourquoi ne peut-on pas réutiliser un identifiant déjà publié sur le Play Store ?**
Sur le Play Store, l'identifiant est la clé unique de chaque application : il est réservé définitivement par son éditeur. Sinon, on pourrait publier une fausse « mise à jour » d'une autre application et se faire passer pour elle.

### Étape 2 : Communication avec l'API

**1. Pourquoi Android bloque-t-il le trafic HTTP par défaut ? Que pourrait lire une personne sur le même Wi-Fi ?**
En HTTP, les échanges circulent **en clair**. Une personne sur le même réseau (Wi-Fi public, attaque *man-in-the-middle*) pourrait lire le login et le mot de passe envoyés à `visiteur/auth`, le token Bearer (et donc se faire passer pour l'utilisateur), ainsi que toutes les notes de frais. Elle pourrait même modifier les réponses. Depuis Android 9, ce trafic est donc bloqué par défaut.

**2. Pourquoi `usesCleartextTraffic` serait-il une mauvaise solution ?**
On ne corrigerait pas le problème, on enlèverait seulement le blocage. Le mot de passe et le jeton circuleraient toujours en clair, lisibles et modifiables par n'importe qui sur le réseau. La bonne solution est de passer l'API en **HTTPS**.

### Étape 3 : EAS Build

**1. Pourquoi le profil `production` vide ne donne-t-il pas un fichier installable directement ?**
Par défaut, le profil `production` génère un **AAB** (Android App Bundle). C'est le format exigé par le Play Store, qui en tire ensuite des APK adaptés à chaque téléphone. Un AAB ne s'installe pas directement sur un téléphone.

**2. Que signifie la distribution « internal » ?**
C'est une distribution **directe**, hors Play Store : l'APK est partagé par un lien ou un QR code. Elle est destinée à un groupe restreint (développeurs, testeurs, enseignants, client) pour tester l'application avant publication. Au contraire, la publication sur le Play Store vise le grand public, après examen par Google.

### Étape 4 : Signature

**1. À quoi sert la signature d'une application Android ? Que vérifie le téléphone lors d'une mise à jour ?**
La signature prouve **l'auteur** de l'APK et garantit son **intégrité** (le fichier n'a pas été modifié depuis la signature). Lors d'une mise à jour, Android vérifie que le nouvel APK est signé avec **la même clé** que la version installée. Sinon, la mise à jour est refusée.

**2. Que se passe-t-il si on perd la clé ? Et si elle est volée ?**
- **Clé perdue** : on ne peut plus publier de mise à jour de l'application. Il faut publier une nouvelle app, avec un autre identifiant, et les utilisateurs doivent la réinstaller. Sur le Play Store, la *Play App Signing* permet de réinitialiser la clé d'envoi.
- **Clé volée** : un attaquant peut signer une version malveillante que les téléphones accepteront comme une mise à jour **légitime**. Il aurait alors accès aux données de l'app (token, notes de frais...).

### Étape 5 : Tests sur téléphone

**1. Mode avion : que se passe-t-il ? Que doit faire une bonne application ?**
La requête ne part pas : `fetch` lève une erreur (*« Network request failed »*). Une bonne application doit afficher un message clair, ne pas planter, et permettre de réessayer. Notre application le fait : `fraisService` et `loginUser` transforment l'erreur réseau en message *« Impossible de joindre le serveur : vérifiez votre connexion internet. »*. Ce message s'affiche en rouge (sur le Dashboard, sous le formulaire ou sur l'écran de connexion). Si une session existe déjà, l'utilisateur reste connecté grâce à AsyncStorage.

**2. Pourquoi reconstruire l'APK après avoir modifié `app.json` ?**
En développement, Expo Go recharge seulement le **code JavaScript** envoyé par Metro. `android.package` (et le reste de la configuration native) est inscrit **dans l'APK compilé** : dans le manifeste Android et dans la signature. Une modification n'apparaît donc qu'après une nouvelle compilation native, c'est-à-dire un nouveau build.

### Étape 6 : Partage

**1. Quel risque présente un lien accessible à toute personne qui le possède ? Comment restreindre l'accès ?**
Le lien peut être transféré ou publié : n'importe qui peut alors télécharger l'APK, l'analyser (le code JS et l'URL de l'API y sont lisibles) ou s'en servir pour attaquer l'API. Pour restreindre l'accès, on peut rendre les builds **privés** dans les paramètres du projet sur expo.dev : seuls les membres connectés au compte ou à l'organisation Expo peuvent alors y accéder. On peut aussi transmettre l'APK par un canal privé.

**2. En quoi l'empreinte SHA-256 protège-t-elle le destinataire ? Pourquoi la transmettre par un autre canal ?**
Le destinataire recalcule l'empreinte du fichier reçu et la compare à celle communiquée. Si elles diffèrent, le fichier a été modifié ou corrompu en route (il pourrait par exemple contenir un malware). Il faut transmettre l'empreinte par un autre canal, car si un attaquant peut remplacer le fichier, il peut aussi remplacer l'empreinte envoyée au même endroit.

**3. Un camarade installe l'APK chez lui en 4G : qu'est-ce qui fonctionne ? Conséquences pour la sécurité ?**
Tout fonctionne (connexion, liste, ajout, modification, suppression), car l'API `https://apigsbfrais.wasmer.app/api/` est accessible depuis Internet, contrairement à l'API du lycée. La contrepartie : l'API est **exposée à tout Internet**. Elle doit donc se protéger elle-même : HTTPS, authentification par token, contrôle que chaque visiteur n'accède qu'à ses données, limitation des tentatives de connexion (contre le *brute force*), mots de passe robustes, et expiration des tokens.

### Pour aller plus loin

1. **HTTPS** protège les données **pendant le transport** : confidentialité et intégrité entre le téléphone et le serveur, et authentification du serveur. Il ne protège pas ce qui est **stocké sur le téléphone** (token et user en clair dans AsyncStorage → il faudrait `expo-secure-store`), ni un token volé (il reste valide jusqu'à expiration), ni le **contenu de l'APK** (code et URL lisibles par décompilation).
2. **Variables d'environnement** : remplacer l'URL en dur par `process.env.EXPO_PUBLIC_API_URL` dans `config.js`, et définir cette variable dans la propriété `env` de chaque profil de `eas.json` (`development`, `preview`, `production`). Attention : une variable `EXPO_PUBLIC_` est intégrée à l'APK, donc jamais de secret dedans.
3. **EAS Update** peut livrer les modifications du **code JavaScript et des assets** (écrans, styles, logique, URL de `config.js`). Un **nouveau build** reste nécessaire pour tout ce qui est natif : `app.json` (`android.package`, permissions, icône...), l'ajout ou la mise à jour d'un module natif, et un changement de version du SDK Expo.
4. **Play Store** : produire un **AAB** (profil `production`), avoir un **compte développeur Google Play** (payant, 25 $ une fois), garder la même clé de signature (ou passer par la *Play App Signing*), incrémenter `versionCode` à chaque version, et fournir une fiche (captures, description, politique de confidentialité). L'envoi peut se faire avec `eas submit`.

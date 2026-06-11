# Campus Ride

**Campus Ride** est une plateforme moderne et épurée de covoiturage étudiant, spécialement conçue pour les étudiants de l'ENSPM (École Nationale Supérieure Polytechnique de Maroua) à l'Université de Maroua. Elle permet de mettre en relation les conducteurs (qui proposent des trajets) et les passagers (qui recherchent et réservent des places) afin de réduire les coûts et de faciliter les déplacements vers les différents sites du campus.

---

## 📂 Structure du Projet (Monorepo)

Le projet est organisé sous forme de monorepo avec deux parties principales :

- **[backend/](file:///c:/Users/HP/Desktop/Nouveau%20dossier%20(2)/backend)** : API REST construite avec Node.js, Express et MongoDB.
- **[frontend/](file:///c:/Users/HP/Desktop/Nouveau%20dossier%20(2)/frontend)** : Application web moderne construite avec React, Vite et CSS personnalisé.

---

## ✨ Fonctionnalités Principales

### 🖥️ Frontend (Interface Utilisateur)
- **Design Moderne & Épuré :** Interface utilisateur élégante inspirée de l'esthétique d'Airbnb, habillée d'un thème violet et d'un arrière-plan immersif.
- **Espace Conducteur Sécurisé :** Les conducteurs peuvent publier des trajets protégés par mot de passe et gérer leurs trajets (visualiser les passagers, annuler les trajets) depuis un tableau de bord privé.
- **Recherche & Filtrage Avancés :** Barre de recherche flottante permettant de filtrer par lieu de départ, lieu d'arrivée, prix maximum ou nom du conducteur.
- **Catégories de Quartiers de Maroua :** Accès et filtrage rapide via des étiquettes représentant les lieux de référence de la ville de Maroua (*Domayo, Kakataré, Dougoy, Missinguiléo, Palar, Sekandé, Kongola, Irad, Ouro-Tchédé*).
- **Validation anti-chevauchement :** Système pour empêcher les réservations et les publications en doublon ou en conflit sur la même période horaire.

### ⚙️ Backend (API REST & Base de données)
- **Serveur Express & Node.js :** Architecture serveur robuste, structurée avec des routes, des contrôleurs et des modèles clairs pour assurer une excellente modularité.
- **Base de données MongoDB Atlas :** Intégration complète avec MongoDB Atlas via Mongoose pour stocker, structurer et requêter les trajets et les réservations en temps réel.
- **Gestion Atomique des Réservations :** Utilisation des opérations atomiques de MongoDB (`findOneAndUpdate` avec `$inc` et `$push`) pour garantir la synchronisation en temps réel et éviter les réservations en doublon ou la surréservation (overbooking).
- **Recherche & Filtrage Multicritère :** Recherche performante côté serveur pour filtrer les trajets par point d'origine ou de destination à l'aide d'expressions régulières (Regex) insensibles à la casse.
- **Sécurité et Configuration (.env) :** Isolation complète des informations sensibles (URI de connexion à la base de données, port de démarrage) par variables d'environnement.
- **Points de Terminaison (API REST) :**
  - `GET /api/rides` : Récupérer tous les trajets disponibles.
  - `GET /api/rides/:id` : Récupérer les détails d'un trajet spécifique.
  - `POST /api/rides` : Créer/publier un nouveau trajet.
  - `POST /api/rides/:id/book` : Réserver une place sur un trajet existant.
  - `GET /api/health` : Vérifier l'état de l'API.



## 🚀 Guide de Démarrage Rapide

### 🔑 Configuration requise
Avoir [Node.js](https://nodejs.org/) installé sur votre machine.

### 1️⃣ Configuration et Lancement du Backend

1. Allez dans le dossier backend :
   ```bash
   cd backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` dans le dossier `backend` et ajoutez-y votre URI de connexion MongoDB Atlas ainsi que le port :
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<votre_utilisateur>:<votre_mot_de_pass>@cluster.mongodb.net/campus_ride
   ```
4. Lancez le serveur :
   * En mode développement (avec redémarrage automatique) :
     ```bash
     npm run dev
     ```
   * En production :
     ```bash
     npm start
     ```

### 2️⃣ Configuration et Lancement du Frontend

1. Allez dans le dossier frontend :
   ```bash
   cd ../frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
4. Ouvrez votre navigateur à l'adresse indiquée par Vite (généralement `http://localhost:5173`).

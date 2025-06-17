## **Students City Mobile**

**TP fil rouge - Évaluation Ionic + Symfony**

* **Backend** : API REST développée avec Symfony auparavant par Bajamin Fouché
* **Frontend** : Application mobile hybride développée avec Ionic React et Capacitor.

## Objectifs

1. Concevoir une architecture modulaire (composants, services).
2. Gérer l’authentification (JWT) et le statut utilisateur (validation admin).
3. Implémenter une carte interactive avec géolocalisation et filtres.
4. Permettre la contribution d’utilisateurs (ajout de lieux).
5. Afficher un splash screen natif et React-level au démarrage.

## Structure du projet

```
students-city/             # racine du projet
│                          # API REST Symfony
├── config/                # configurations Symfony
├── src/                   # code source (Controllers, Entities, Services)
├── migrations/            # migrations Doctrine
├── public/                # dossiers publics (assets)
├── .env                   # variables d'environnement
├── composer.json          # dépendances PHP
├── README.md              # instructions Backend
│
└── student-city-ionic/    # Ionic React + Capacitor
    ├── public/            # icônes, index.html
    ├── src/               # code source React (pages, components, services)
    │   ├── components/    # Splash, Loader, etc.
    │   ├── pages/         # Login, Home, Places, Admin...
    │   ├── services/      # appels API, auth JWT
    │   ├── resources/     # splash.png
    │   ├── theme/         # variables et styles CSS
    │   └── App.tsx        # point d'entrée, routing, splash React
    ├── capacitor.config.ts
    ├── package.json
    └── README.md          # instructions Frontend

```

## Installation & démarrage

### Technologies

* **Node.js** et **npm**
* **PHP** avec **Composer**
* **Symfony CLI**
* **Ionic CLI** & **Capacitor CLI**
* Émulateur Android (Android Studio) ou iOS (Xcode)

### 1. Installer les dépendances Backend (Symfony)

```bash
cd backend
composer install
```

### 3. Installer les dépendances Frontend (Ionic React)

```bash
cd ../mobile
npm install

npm install -g @ionic/cli

npm install -g @capacitor/cli
```

### 4. Générer icônes & splash screen

```bash
npm install --save-dev @capacitor/assets
npx capacitor-assets generate
```

### 5. Synchroniser Capacitor

```bash
npx cap copy
```

### 6. Initialiser et migrer la base de données (Backend)

```bash
dans la racine du projet
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

### 7. Lancer le projet

* Pour lancer le projet en environnement de développement, utilise la commande suivante :

```bash
npm run dev
```

* Cette commande exécute deux processus en parallèle :

  * `Backend Laravel` :
    Démarre un serveur PHP local sur http://127.0.0.1:8000 à partir du dossier public/.

  * `Frontend Ionic` :
    Lance l'application Ionic en mode développement via ionic serve, généralement accessible sur http://localhost:8100.

## Configuration

* **Fichier `.env.local` (Backend)**

  * `DATABASE_URL`: connexion à la BDD
  * `JWT_SECRET_KEY`: clé secrète JWT

* **`capacitor.config.ts` (Frontend)**

  * `appId`, `appName`,
  * plugin `SplashScreen` (durée, couleur)
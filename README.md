# 🎓 StudyFlow - Social Habit Tracker

**Application collaborative de suivi d'habitudes pour équipes**

## 🚀 Accès à l'application

### 🌐 Version Web
**URL : https://iintervilla-lab.github.io/studyflow-promo2025/**

### 📱 Installation sur téléphone
1. Ouvrez l'URL ci-dessus sur votre téléphone
2. Appuyez sur "Ajouter à l'écran d'accueil"
3. L'app sera installée comme une vraie application mobile

### 🔐 Connexion
- **Mot de passe** : `promo2025`
- **Prénom** : Votre prénom pour personnalisation

## ✨ Fonctionnalités

### 👤 Espace Personnel
- ✅ **To-do list** : Tâches individuelles avec statut terminé/en cours
- 🔥 **Habitudes flexibles** :
  - **Quotidien** : Sport, Lecture, Eau, Sommeil, Repas sain, Social
  - **Hebdomadaire** : Réunions équipe (lundi)
  - **Mensuel** : Formation continue (1er du mois)
  - **Annuel** : Bilan annuel (1er janvier)
- 📊 **Progression globale** : Barre de progression basée sur tâches + habitudes
- 🔒 **Transparence sélective** : Toggle Public/Privé pour le classement groupe
- 💡 **Inspiration** : Citations motivantes avec bouton "Nouvelle citation"

### 👥 Espace Groupe
- 🏆 **Tops** : Ce qui va bien dans le groupe
- 🚨 **Flops** : Ce qu'on peut améliorer
- 📈 **Classement** : Progression des membres (seulement ceux en public)
- 💬 **Chat collectif** : Messagerie temps réel

## 🎯 Objectif

"Permettre à une communauté de travailler individuellement tout en étant une source de motivation pour ses pairs grâce à la transparence sélective."

## � Version APK Android (Nouvelle fonctionnalité !)

### 🚀 Génération automatique d'APK

L'application peut maintenant être convertie en APK Android natif avec **mode hors ligne complet** et **synchronisation automatique**.

#### Prérequis
- Node.js installé ([télécharger](https://nodejs.org/))
- Git installé

#### Étapes de génération
```bash
# 1. Installer PWABuilder CLI
npm install -g @pwabuilder/cli

# 2. Générer l'APK depuis l'URL déployée
pwabuilder https://iintervilla-lab.github.io/studyflow-promo2025 --apk
```

#### Installation sur Android
1. Transférez le fichier `.apk` généré sur votre téléphone
2. Dans **Paramètres > Sécurité > Autoriser les sources inconnues**
3. Ouvrez le fichier `.apk` et installez l'application

### 🔄 Fonctionnalités APK avancées

- **Mode hors ligne complet** : Fonctionne sans connexion internet
- **Synchronisation automatique** : Données synchronisées quand la connexion revient
- **Notifications push** : Alertes de synchronisation et rappels
- **Interface native** : Apparence et comportement d'une vraie app Android
- **Raccourcis rapides** : Accès direct aux sections depuis l'écran d'accueil

### 📶 Gestion de la connectivité

L'app détecte automatiquement :
- **🔌 Connexion perdue** : Bascule en mode hors ligne, stocke localement
- **📡 Connexion rétablie** : Synchronise automatiquement avec notification
- **🔔 Notifications** : Informe du statut de connexion en temps réel

## 📊 État du développement

| Fonctionnalité | État | Description |
|---|---|---|
| ✅ Gestion tâches individuelles | **Complet** | CRUD complet avec statut |
| ✅ Suivi habitudes flexibles | **Complet** | 9 habitudes, 4 fréquences |
| ✅ Transparence sélective | **Complet** | Toggle public/privé |
| ✅ Widget inspiration | **Complet** | Citations aléatoires |
| ✅ Écosystème communautaire | **Complet** | Tops/Flops + chat |
| 🔄 Statistiques automatiques | **À venir** | Graphiques d'évolution |
| 🔄 Synchronisation Google | **À venir** | Calendar + Gmail |
| 🔄 Widgets résumé collectif | **À venir** | Dashboard équipe |

## 🚀 Déploiement

L'application est automatiquement déployée via GitHub Pages à chaque push sur la branche `master`.

### Backend local

Un backend Node/Express est maintenant disponible pour gérer l'authentification et les données de groupe.

- Installer les dépendances : `npm install`
- Démarrer le backend : `npm start`
- L'API est disponible sur : `http://localhost:3000`

**Dernière mise à jour** : Evolution vers Social Habit Tracker avec fréquences flexibles et transparence sélective.

---

**Promo 2025** - Développé avec ❤️ pour booster la productivité collective !</content>
<parameter name="filePath">README.md
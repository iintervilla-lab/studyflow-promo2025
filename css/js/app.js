/* ═══════════════════════════════════════════════════════════
   app.js — Chef d'orchestre de StudyFlow
   Rôle : état global de l'appli + navigation entre les pages
   Chargé EN PREMIER par le HTML (premier script)
   ═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────
   1. ÉTAT GLOBAL
   ──────────────────────────────────────────────────────────
   C'est l'unique source de vérité de l'appli.
   Tous les autres fichiers JS lisent et modifient
   cet objet pour partager l'information.
   On le met sur `window` pour qu'il soit accessible
   partout sans import (on n'utilise pas de modules).
────────────────────────────────────────────────────────── */
window.AppState = {
  /* Prénom de l'utilisateur connecté (ex: "Koffi") */
  prenom: '',

  /* Page actuellement affichée */
  pageActive: 'page-moi',

  /* Est-ce que l'utilisateur est connecté ? */
  estConnecte: false,
};


/* ──────────────────────────────────────────────────────────
   2. CONSTANTES — clés de stockage localStorage
   ──────────────────────────────────────────────────────────
   localStorage = mémoire du navigateur qui persiste
   même après fermeture de l'onglet.
   On centralise ici les noms des clés pour éviter
   les fautes de frappe dans les autres fichiers.
────────────────────────────────────────────────────────── */
window.CLES = {
  SESSION:   'sf_session',    /* { prenom, dateConnexion } */
  TODOS:     'sf_todos',      /* tableau de tâches */
  HABITUDES: 'sf_habitudes',  /* { dateJour, cochees: [] } */
  TOPS:      'sf_tops',       /* tableau de tops */
  FLOPS:     'sf_flops',      /* tableau de flops */
  CHAT:      'sf_chat',       /* tableau de messages */
  SCORES:    'sf_scores',     /* { prenom: pourcentage } */
  VISIBILITE: 'sf_visibilite', /* { prenom: boolean } */
};


/* ──────────────────────────────────────────────────────────
   3. UTILITAIRES LOCALSTORAGE
   ──────────────────────────────────────────────────────────
   Deux fonctions simples pour lire/écrire dans
   localStorage avec gestion automatique du JSON.
────────────────────────────────────────────────────────── */

/**
 * Lit une valeur dans localStorage.
 * @param {string} cle  — la clé (ex: window.CLES.TODOS)
 * @param {*} defaut    — valeur si rien n'est enregistré
 * @returns la valeur désérialisée ou la valeur par défaut
 */
window.lireStockage = function(cle, defaut = null) {
  try {
    const valeur = localStorage.getItem(cle);
    /* Si rien n'existe encore, on retourne la valeur par défaut */
    if (valeur === null) return defaut;
    return JSON.parse(valeur);
  } catch (e) {
    /* Si le JSON est corrompu, on efface et repart à zéro */
    console.warn(`[AppState] Erreur lecture "${cle}", réinitialisation.`, e);
    localStorage.removeItem(cle);
    return defaut;
  }
};

/**
 * Écrit une valeur dans localStorage.
 * @param {string} cle   — la clé
 * @param {*} valeur     — n'importe quelle valeur (objet, tableau, string…)
 */
window.ecrireStockage = function(cle, valeur) {
  try {
    localStorage.setItem(cle, JSON.stringify(valeur));
  } catch (e) {
    /* localStorage peut être plein (quota dépassé) */
    console.error(`[AppState] Impossible d'écrire "${cle}".`, e);
  }
};


/* ──────────────────────────────────────────────────────────
   4. NAVIGATION — changer de page
   ──────────────────────────────────────────────────────────
   Principe : on cache TOUTES les sections .page,
   puis on affiche uniquement celle demandée.
   On fait pareil pour les boutons de nav (.nav-btn).
────────────────────────────────────────────────────────── */

/**
 * Affiche la page demandée et met à jour la nav.
 * @param {string} idPage — ex: 'page-moi', 'page-groupe', 'page-chat'
 */
window.allerPage = function(idPage) {

  /* --- a) Cacher toutes les pages --- */
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  /* --- b) Afficher la page demandée --- */
  const pageCible = document.getElementById(idPage);
  if (!pageCible) {
    console.warn(`[Nav] Page introuvable : "${idPage}"`);
    return;
  }
  pageCible.classList.add('active');

  /* --- c) Mettre à jour les boutons de nav --- */
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.page === idPage) {
      btn.classList.add('active');
    }
  });

  /* --- d) Mémoriser la page active dans l'état global --- */
  window.AppState.pageActive = idPage;

  /* --- e) Si on arrive sur le chat : effacer le badge --- */
  if (idPage === 'page-chat') {
    const badge = document.getElementById('chat-badge');
    if (badge) badge.classList.add('cachee');

    /* Scroller en bas du chat pour voir les derniers messages */
    const zoneMessages = document.getElementById('chat-messages');
    if (zoneMessages) {
      /* On attend 50ms que le DOM soit rendu avant de scroller */
      setTimeout(() => {
        zoneMessages.scrollTop = zoneMessages.scrollHeight;
      }, 50);
    }
  }

  /* --- f) Scroller le contenu principal en haut --- */
  const contenu = document.querySelector('.app-contenu');
  if (contenu) contenu.scrollTop = 0;
};


/* ──────────────────────────────────────────────────────────
   5. AFFICHER / CACHER L'APPLICATION
   ──────────────────────────────────────────────────────────
   Après connexion : on cache l'écran de login
   et on révèle le shell de l'app.
────────────────────────────────────────────────────────── */

/**
 * Révèle l'application principale et personnalise l'interface.
 * Appelé par auth.js après une connexion réussie.
 * @param {string} prenom — prénom saisi par l'utilisateur
 */
window.ouvrirApp = function(prenom) {

  /* Mettre à jour l'état global */
  window.AppState.prenom = prenom;
  window.AppState.estConnecte = true;

  /* Cacher l'écran de connexion */
  const ecranConnexion = document.getElementById('ecran-connexion');
  if (ecranConnexion) ecranConnexion.classList.remove('actif');

  /* Révéler l'app */
  const app = document.getElementById('app');
  if (app) app.classList.remove('cachee');

  /* Afficher le prénom dans le header */
  const headerPrenom = document.getElementById('header-prenom');
  if (headerPrenom) headerPrenom.textContent = `👋 ${prenom}`;

  /* Afficher le prénom dans le titre de la page "Mon espace" */
  const prenomMoi = document.getElementById('prenom-moi');
  if (prenomMoi) prenomMoi.textContent = prenom;

  /* Naviguer vers la page d'accueil */
  window.allerPage('page-moi');

  /* Initialiser les autres modules (définis dans leurs fichiers) */
  /* On vérifie que la fonction existe avant de l'appeler,
     car les scripts sont chargés en parallèle */
  if (typeof window.initTodo    === 'function') window.initTodo();
  if (typeof window.initGroupe  === 'function') window.initGroupe();
  if (typeof window.initChat    === 'function') window.initChat();
};


/**
 * Ferme l'application et retourne à l'écran de connexion.
 * Appelé par le bouton "⬅ Quitter".
 */
window.fermerApp = function() {

  /* Effacer la session */
  localStorage.removeItem(window.CLES.SESSION);

  /* Réinitialiser l'état global */
  window.AppState.prenom = '';
  window.AppState.estConnecte = false;
  window.AppState.pageActive = 'page-moi';

  /* Cacher l'app */
  const app = document.getElementById('app');
  if (app) app.classList.add('cachee');

  /* Réafficher l'écran de connexion */
  const ecranConnexion = document.getElementById('ecran-connexion');
  if (ecranConnexion) ecranConnexion.classList.add('actif');

  /* Vider le champ mot de passe par sécurité */
  const inputMdp = document.getElementById('input-mdp');
  if (inputMdp) inputMdp.value = '';
};


/* ──────────────────────────────────────────────────────────
   6. INITIALISATION AU CHARGEMENT DE LA PAGE
   ──────────────────────────────────────────────────────────
   Quand le HTML est entièrement chargé, on branche
   tous les événements et on vérifie si une session
   existe déjà (reconnexion automatique).
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {

  /* --- Boutons de navigation --- */
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idPage = this.dataset.page; /* ex: "page-moi" */
      window.allerPage(idPage);
    });
  });

  /* --- Bouton déconnexion --- */
  const btnDeconnexion = document.getElementById('btn-deconnexion');
  if (btnDeconnexion) {
    btnDeconnexion.addEventListener('click', function() {
      /* Petite confirmation avant de déconnecter */
      if (confirm('Tu veux vraiment quitter l\'espace groupe ?')) {
        window.fermerApp();
      }
    });
  }

  /* --- Reconnexion automatique ---
     Si une session existe déjà dans localStorage,
     on reconnecte directement sans redemander le mot de passe.
     Pratique sur mobile : l'app se "souvient" de toi.
  */
  const session = window.lireStockage(window.CLES.SESSION);
  if (session && session.prenom) {

    /* Vérifier que la session date de moins de 7 jours */
    const maintenant = Date.now();
    const septJoursMs = 7 * 24 * 60 * 60 * 1000;
    const sessionValide = (maintenant - session.dateConnexion) < septJoursMs;

    if (sessionValide) {
      /* Reconnexion silencieuse */
      window.ouvrirApp(session.prenom);
    } else {
      /* Session expirée : on nettoie */
      localStorage.removeItem(window.CLES.SESSION);
    }
  }

  console.log('✅ app.js initialisé');
});

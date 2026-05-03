/* ═══════════════════════════════════════════════════════════
   auth.js — Logique de connexion de StudyFlow
   Rôle : vérifier le mot de passe, sauvegarder la session,
          gérer les erreurs et les retours clavier
   Dépend de : app.js (window.ouvrirApp, window.ecrireStockage)
   ═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────
   1. CONFIGURATION
   ──────────────────────────────────────────────────────────
   Le mot de passe est défini ici en une seule ligne.
   Pour le changer : modifie uniquement cette constante.
────────────────────────────────────────────────────────── */
const MOT_DE_PASSE_GROUPE = 'promo2025';

/*
  Nombre maximum de tentatives avant blocage temporaire.
  Évite les essais en rafale.
*/
const MAX_TENTATIVES = 5;
const DUREE_BLOCAGE_MS = 30 * 1000; /* 30 secondes */


/* ──────────────────────────────────────────────────────────
   2. ÉTAT LOCAL DU MODULE AUTH
   ──────────────────────────────────────────────────────────
   Ces variables ne concernent que l'écran de connexion.
   Pas besoin de les mettre dans AppState.
────────────────────────────────────────────────────────── */
let nombreTentatives = 0;
let bloquéJusquA = 0; /* timestamp de fin de blocage */


/* ──────────────────────────────────────────────────────────
   3. RÉCUPÉRATION DES ÉLÉMENTS DU DOM
   ──────────────────────────────────────────────────────────
   On les récupère une seule fois et on les stocke
   dans des variables. C'est plus rapide que de les
   chercher à chaque frappe.
────────────────────────────────────────────────────────── */
const inputPrenom  = document.getElementById('input-prenom');
const inputMdp     = document.getElementById('input-mdp');
const btnConnexion = document.getElementById('btn-connexion');
const msgErreur    = document.getElementById('auth-erreur');


/* ──────────────────────────────────────────────────────────
   4. FONCTIONS UTILITAIRES
────────────────────────────────────────────────────────── */

/**
 * Affiche un message d'erreur dans la zone prévue.
 * @param {string} texte — le message à afficher
 */
function afficherErreur(texte) {
  if (!msgErreur) return;
  msgErreur.textContent = texte;
  msgErreur.classList.remove('cachee');

  /* Force une ré-animation CSS de secousse même si déjà visible */
  msgErreur.style.animation = 'none';
  /* Ce "void" force le navigateur à recalculer le style,
     indispensable pour relancer l'animation */
  void msgErreur.offsetWidth;
  msgErreur.style.animation = '';
}

/**
 * Cache le message d'erreur.
 */
function cacherErreur() {
  if (!msgErreur) return;
  msgErreur.classList.add('cachee');
}

/**
 * Nettoie et normalise le prénom saisi.
 * Ex : "  koffi  " → "Koffi"
 * @param {string} texte brut
 * @returns {string} prénom formaté
 */
function normaliserPrenom(texte) {
  const nettoye = texte.trim();
  if (!nettoye) return '';
  /* Première lettre en majuscule, reste en minuscule */
  return nettoye.charAt(0).toUpperCase() + nettoye.slice(1).toLowerCase();
}

/**
 * Active ou désactive le bouton de connexion
 * et change son texte selon l'état.
 * @param {boolean} actif
 * @param {string} texte — texte du bouton
 */
function setEtatBouton(actif, texte) {
  if (!btnConnexion) return;
  btnConnexion.disabled = !actif;
  btnConnexion.textContent = texte;
  /* Opacité réduite = signal visuel de désactivation */
  btnConnexion.style.opacity = actif ? '1' : '0.6';
  btnConnexion.style.cursor  = actif ? 'pointer' : 'not-allowed';
}


/* ──────────────────────────────────────────────────────────
   5. LOGIQUE PRINCIPALE : TENTATIVE DE CONNEXION
   ──────────────────────────────────────────────────────────
   C'est le cœur du module. Appelée quand l'utilisateur
   clique sur le bouton ou appuie sur Entrée.
────────────────────────────────────────────────────────── */

function tenterConnexion() {

  /* --- a) Vérifier si le compte est temporairement bloqué --- */
  const maintenant = Date.now();
  if (maintenant < bloquéJusquA) {
    const secondesRestantes = Math.ceil((bloquéJusquA - maintenant) / 1000);
    afficherErreur(`⏳ Trop de tentatives. Réessaie dans ${secondesRestantes}s.`);
    return; /* On stoppe ici */
  }

  /* --- b) Lire et valider le prénom --- */
  const prenomBrut = inputPrenom ? inputPrenom.value : '';
  const prenom = normaliserPrenom(prenomBrut);

  if (!prenom) {
    afficherErreur('👤 Entre ton prénom d\'abord !');
    if (inputPrenom) inputPrenom.focus();
    return;
  }

  if (prenom.length < 2) {
    afficherErreur('👤 Ton prénom doit faire au moins 2 caractères.');
    if (inputPrenom) inputPrenom.focus();
    return;
  }

  /* --- c) Lire et valider le mot de passe --- */
  const mdpSaisi = inputMdp ? inputMdp.value : '';

  if (!mdpSaisi) {
    afficherErreur('🔑 Entre le mot de passe du groupe !');
    if (inputMdp) inputMdp.focus();
    return;
  }

  /* --- d) Vérifier le mot de passe ---
     On compare en minuscules pour être indulgent
     (évite les erreurs de casse : "Promo2025" = "promo2025")
  */
  const mdpCorrect = mdpSaisi.trim().toLowerCase() === MOT_DE_PASSE_GROUPE.toLowerCase();

  if (!mdpCorrect) {
    nombreTentatives++;

    /* Calculer les tentatives restantes avant blocage */
    const restantes = MAX_TENTATIVES - nombreTentatives;

    if (restantes <= 0) {
      /* Bloquer pendant 30 secondes */
      bloquéJusquA = Date.now() + DUREE_BLOCAGE_MS;
      nombreTentatives = 0; /* Réinitialiser pour le prochain cycle */
      afficherErreur('🚫 Trop de tentatives. Attends 30 secondes.');
      setEtatBouton(false, '⏳ Attends...');

      /* Débloquer automatiquement après 30s */
      setTimeout(() => {
        bloquéJusquA = 0;
        setEtatBouton(true, 'Entrer dans l\'espace →');
        cacherErreur();
      }, DUREE_BLOCAGE_MS);

    } else if (restantes === 1) {
      afficherErreur(`❌ Mot de passe incorrect. Dernière tentative !`);
    } else {
      afficherErreur(`❌ Mot de passe incorrect. (${restantes} essais restants)`);
    }

    /* Vider le champ et remettre le focus dessus */
    if (inputMdp) {
      inputMdp.value = '';
      inputMdp.focus();
    }
    return;
  }

  /* ─── CONNEXION RÉUSSIE ─────────────────────────────────── */

  /* Réinitialiser le compteur d'erreurs */
  nombreTentatives = 0;
  cacherErreur();

  /* Retour visuel : le bouton montre que ça charge */
  setEtatBouton(false, '✓ Connexion...');

  /* Sauvegarder la session dans localStorage
     (permet la reconnexion automatique au prochain visit) */
  window.ecrireStockage(window.CLES.SESSION, {
    prenom: prenom,
    dateConnexion: Date.now(),
  });

  /* Petit délai pour que l'animation du bouton soit visible
     (200ms suffisent, pas besoin de plus) */
  setTimeout(() => {
    window.ouvrirApp(prenom);
    /* Remettre le bouton en état normal pour la déco */
    setEtatBouton(true, 'Entrer dans l\'espace →');
  }, 200);
}


/* ──────────────────────────────────────────────────────────
   6. BRANCHEMENT DES ÉVÉNEMENTS
   ──────────────────────────────────────────────────────────
   On écoute :
   - Le clic sur le bouton
   - La touche Entrée dans les deux champs
   - La frappe dans les champs (pour cacher l'erreur)
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {

  /* Vérifier que les éléments existent (sécurité) */
  if (!btnConnexion) {
    console.warn('[Auth] Bouton de connexion introuvable.');
    return;
  }

  /* --- Clic sur le bouton --- */
  btnConnexion.addEventListener('click', tenterConnexion);

  /* --- Touche Entrée dans le champ mot de passe --- */
  if (inputMdp) {
    inputMdp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') tenterConnexion();
    });
  }

  /* --- Touche Entrée dans le champ prénom :
     passe au champ suivant (comportement naturel) --- */
  if (inputPrenom) {
    inputPrenom.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        if (inputMdp) inputMdp.focus();
      }
    });
  }

  /* --- Frappe dans n'importe quel champ : cacher l'erreur ---
     L'erreur disparaît dès que l'utilisateur recommence à taper.
     C'est plus agréable que de la laisser affichée.
  */
  [inputPrenom, inputMdp].forEach(input => {
    if (!input) return;
    input.addEventListener('input', function() {
      cacherErreur();
    });
  });

  /* --- Mettre le focus sur le prénom au chargement ---
     Sur mobile, ça peut faire apparaître le clavier
     automatiquement (comportement variable selon les OS).
     On le décale de 300ms pour laisser l'animation de la
     carte se terminer d'abord.
  */
  setTimeout(() => {
    /* Ne mettre le focus que si on est bien sur l'écran de connexion */
    const ecranConnexion = document.getElementById('ecran-connexion');
    const estVisible = ecranConnexion && ecranConnexion.classList.contains('actif');
    if (estVisible && inputPrenom) {
      inputPrenom.focus();
    }
  }, 300);

  console.log('✅ auth.js initialisé');
});

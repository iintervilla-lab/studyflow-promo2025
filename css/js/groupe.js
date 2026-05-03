/* ═══════════════════════════════════════════════════════════
   groupe.js — Logique de la page "Groupe"
   Rôle : gérer les tops/flops collectifs et le classement
   Dépend de : app.js (window.CLES, window.lireStockage, window.ecrireStockage)
   ═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────
   1. ÉLÉMENTS DU DOM
   ────────────────────────────────────────────────────────── */
let inputTop, btnAjouterTop, listeTops;
let inputFlop, btnAjouterFlop, listeFlops;
let listeClassement;

/* ──────────────────────────────────────────────────────────
   2. INITIALISATION
   ────────────────────────────────────────────────────────── */
window.initGroupe = function() {
  console.log('✅ Initialisation groupe.js');

  /* Récupérer les éléments du DOM */
  inputTop = document.getElementById('input-top');
  btnAjouterTop = document.getElementById('btn-ajouter-top');
  listeTops = document.getElementById('liste-tops');

  inputFlop = document.getElementById('input-flop');
  btnAjouterFlop = document.getElementById('btn-ajouter-flop');
  listeFlops = document.getElementById('liste-flops');

  listeClassement = document.getElementById('classement-liste');

  /* Brancher les événements */
  if (btnAjouterTop) {
    btnAjouterTop.addEventListener('click', () => ajouterAvis('top'));
  }
  if (inputTop) {
    inputTop.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') ajouterAvis('top');
    });
  }

  if (btnAjouterFlop) {
    btnAjouterFlop.addEventListener('click', () => ajouterAvis('flop'));
  }
  if (inputFlop) {
    inputFlop.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') ajouterAvis('flop');
    });
  }

  /* Charger les données */
  chargerAvis();
  mettreAJourClassement();
};

/* ──────────────────────────────────────────────────────────
   3. GESTION DES AVIS (TOPS & FLOPS)
   ────────────────────────────────────────────────────────── */

/**
 * Ajoute un top ou un flop.
 * @param {string} type — 'top' ou 'flop'
 */
function ajouterAvis(type) {
  const input = type === 'top' ? inputTop : inputFlop;
  const liste = type === 'top' ? listeTops : listeFlops;

  if (!input || !liste) return;

  const texte = input.value.trim();
  if (!texte) return;

  /* Créer l'avis */
  const avis = {
    id: Date.now(),
    texte: texte,
    auteur: window.AppState.prenom,
    date: new Date().toISOString(),
    type: type
  };

  /* Sauvegarder */
  const cle = type === 'top' ? window.CLES.TOPS : window.CLES.FLOPS;
  const avisExistants = window.lireStockage(cle, []);
  avisExistants.push(avis);
  window.ecrireStockage(cle, avisExistants);

  /* Ajouter à l'interface */
  ajouterAvisDOM(avis);

  /* Vider le champ */
  input.value = '';
}

/**
 * Ajoute un avis à l'interface.
 * @param {Object} avis — {id, texte, auteur, date, type}
 */
function ajouterAvisDOM(avis) {
  const liste = avis.type === 'top' ? listeTops : listeFlops;
  if (!liste) return;

  const li = document.createElement('li');
  li.className = `avis-item ${avis.type}`;
  li.dataset.id = avis.id;

  /* Formater la date */
  const date = new Date(avis.date);
  const heure = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  li.innerHTML = `
    ${avis.texte}
    <span class="avis-auteur">${avis.auteur}</span>
  `;

  liste.appendChild(li);
}

/**
 * Charge et affiche tous les avis sauvegardés.
 */
function chargerAvis() {
  /* Charger les tops */
  const tops = window.lireStockage(window.CLES.TOPS, []);
  tops.forEach(ajouterAvisDOM);

  /* Charger les flops */
  const flops = window.lireStockage(window.CLES.FLOPS, []);
  flops.forEach(ajouterAvisDOM);
}

/* ──────────────────────────────────────────────────────────
   4. CLASSEMENT DE PROGRESSION
   ────────────────────────────────────────────────────────── */

/**
 * Met à jour le classement basé sur les scores sauvegardés.
 */
function mettreAJourClassement() {
  if (!listeClassement) return;

  const scores = window.lireStockage(window.CLES.SCORES, {});

  /* Convertir en tableau pour trier */
  const classement = Object.entries(scores)
    .map(([prenom, score]) => ({ prenom, score }))
    .sort((a, b) => b.score - a.score); /* Du plus haut au plus bas */

  /* Vider la liste */
  listeClassement.innerHTML = '';

  /* Afficher le classement */
  classement.forEach((joueur, index) => {
    const li = document.createElement('li');
    li.className = 'classement-item';

    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';

    li.innerHTML = `
      <span class="classement-medaille">${medal}</span>
      <span class="classement-prenom">${joueur.prenom}</span>
      <span class="classement-score">${joueur.score}%</span>
    `;

    listeClassement.appendChild(li);
  });

  /* Si pas de scores */
  if (classement.length === 0) {
    const li = document.createElement('li');
    li.className = 'classement-vide';
    li.textContent = 'Aucun score enregistré pour le moment';
    listeClassement.appendChild(li);
  }
}

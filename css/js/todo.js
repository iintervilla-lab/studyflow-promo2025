/* ═══════════════════════════════════════════════════════════
   todo.js — Logique de la page "Mon espace"
   Rôle : gérer la to-do list et les habitudes quotidiennes
   Dépend de : app.js (window.AppState, window.CLES, window.lireStockage, window.ecrireStockage)
   ═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────
   1. CONSTANTES — liste des habitudes prédéfinies
   ──────────────────────────────────────────────────────────
   Les habitudes sont fixes mais cochables selon leur fréquence.
   Fréquences supportées : quotidien, hebdomadaire, mensuel, annuel
────────────────────────────────────────────────────────── */
const HABITUDES_PREDEFINIES = [
  { id: 'sport', nom: 'Sport', icone: '🏃', frequence: 'quotidien' },
  { id: 'lecture', nom: 'Lecture', icone: '📖', frequence: 'quotidien' },
  { id: 'eau', nom: 'Boire eau', icone: '💧', frequence: 'quotidien' },
  { id: 'sommeil', nom: 'Bien dormir', icone: '😴', frequence: 'quotidien' },
  { id: 'repas', nom: 'Manger sain', icone: '🥗', frequence: 'quotidien' },
  { id: 'social', nom: 'Parler proches', icone: '💬', frequence: 'quotidien' },
  { id: 'reunion', nom: 'Réunion équipe', icone: '👥', frequence: 'hebdomadaire' },
  { id: 'formation', nom: 'Formation continue', icone: '📚', frequence: 'mensuel' },
  { id: 'bilan', nom: 'Bilan annuel', icone: '📊', frequence: 'annuel' },
];

/* ──────────────────────────────────────────────────────────
   CITATIONS MOTIVANTES
   ────────────────────────────────────────────────────────── */
const CITATIONS = [
  {
    texte: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
    auteur: "Winston Churchill"
  },
  {
    texte: "La seule façon de faire du bon travail est d'aimer ce que vous faites.",
    auteur: "Steve Jobs"
  },
  {
    texte: "Le futur appartient à ceux qui croient en la beauté de leurs rêves.",
    auteur: "Eleanor Roosevelt"
  },
  {
    texte: "Ce que nous faisons aujourd'hui, de manière répétée, devient ce que nous sommes.",
    auteur: "Aristote"
  },
  {
    texte: "La discipline est le pont entre les objectifs et les accomplissements.",
    auteur: "Jim Rohn"
  },
  {
    texte: "Petit à petit, l'oiseau fait son nid.",
    auteur: "Proverbe français"
  },
  {
    texte: "Le changement que vous souhaitez voir dans le monde commence par vous-même.",
    auteur: "Mahatma Gandhi"
  },
  {
    texte: "La persévérance n'est pas une course de vitesse, c'est une course d'endurance.",
    auteur: "Proverbe"
  }
];

/* ──────────────────────────────────────────────────────────
   2. ÉLÉMENTS DU DOM
   ────────────────────────────────────────────────────────── */
let inputTodo, btnAjouterTodo, listeTodos;
let grilleHabitudes;
let barreProgression, pourcentGlobal;
let togglePublic;
let citationElement, btnNouvelleCitation;

/* ──────────────────────────────────────────────────────────
   3. INITIALISATION
   ────────────────────────────────────────────────────────── */
window.initTodo = function() {
  console.log('✅ Initialisation todo.js');

  /* Récupérer les éléments du DOM */
  inputTodo = document.getElementById('todo-input');
  btnAjouterTodo = document.getElementById('todo-ajouter');
  listeTodos = document.getElementById('todo-liste');
  grilleHabitudes = document.getElementById('habitudes-liste');
  barreProgression = document.getElementById('barre-progression');
  pourcentGlobal = document.getElementById('pourcentage-global');
  togglePublic = document.getElementById('toggle-public');
  citationElement = document.getElementById('citation-du-jour');
  btnNouvelleCitation = document.getElementById('nouvelle-citation');

  /* Brancher les événements */
  if (btnAjouterTodo) {
    btnAjouterTodo.addEventListener('click', ajouterTodo);
  }
  if (inputTodo) {
    inputTodo.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') ajouterTodo();
    });
  }
  if (togglePublic) {
    togglePublic.addEventListener('change', changerVisibilite);
    /* Charger l'état actuel */
    const visibilite = window.lireStockage(window.CLES.VISIBILITE, {});
    togglePublic.checked = visibilite[window.AppState.prenom] || false;
  }
  if (btnNouvelleCitation) {
    btnNouvelleCitation.addEventListener('click', changerCitation);
  }

  /* Charger les données sauvegardées */
  chargerTodos();
  chargerHabitudes();

  /* Calculer et afficher la progression */
  mettreAJourProgression();

  /* Afficher une citation aléatoire */
  changerCitation();
};

/* ──────────────────────────────────────────────────────────
   4. GESTION DES TO-DOS
   ────────────────────────────────────────────────────────── */

/**
 * Ajoute une nouvelle tâche à la liste.
 */
function ajouterTodo() {
  if (!inputTodo || !listeTodos) return;

  const texte = inputTodo.value.trim();
  if (!texte) return;

  /* Créer la tâche */
  const tache = {
    id: Date.now(), /* timestamp unique */
    texte: texte,
    terminee: false,
    dateCreation: new Date().toISOString()
  };

  /* Sauvegarder */
  const todos = window.lireStockage(window.CLES.TODOS, []);
  todos.push(tache);
  window.ecrireStockage(window.CLES.TODOS, todos);

  /* Ajouter à l'interface */
  ajouterTodoDOM(tache);

  /* Vider le champ */
  inputTodo.value = '';

  /* Recalculer la progression */
  mettreAJourProgression();
}

/**
 * Ajoute une tâche à l'interface utilisateur.
 * @param {Object} tache — {id, texte, terminee}
 */
function ajouterTodoDOM(tache) {
  if (!listeTodos) return;

  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = tache.id;

  if (tache.terminee) {
    li.classList.add('terminee');
  }

  li.innerHTML = `
    <input type="checkbox" id="tache-${tache.id}" ${tache.terminee ? 'checked' : ''} />
    <label for="tache-${tache.id}">${tache.texte}</label>
    <button class="todo-supprimer" title="Supprimer">🗑</button>
  `;

  /* Brancher les événements */
  const checkbox = li.querySelector('input[type="checkbox"]');
  const btnSupprimer = li.querySelector('.todo-supprimer');

  checkbox.addEventListener('change', () => cocherTodo(tache.id, checkbox.checked));
  btnSupprimer.addEventListener('click', () => supprimerTodo(tache.id));

  listeTodos.appendChild(li);
}

/**
 * Coche/décoche une tâche.
 * @param {number} idTache
 * @param {boolean} cochee
 */
function cocherTodo(idTache, cochee) {
  /* Mettre à jour en mémoire */
  const todos = window.lireStockage(window.CLES.TODOS, []);
  const tache = todos.find(t => t.id === idTache);
  if (tache) {
    tache.terminee = cochee;
    window.ecrireStockage(window.CLES.TODOS, todos);
  }

  /* Mettre à jour l'interface */
  const li = listeTodos.querySelector(`[data-id="${idTache}"]`);
  if (li) {
    if (cochee) {
      li.classList.add('terminee');
    } else {
      li.classList.remove('terminee');
    }
  }

  /* Recalculer la progression */
  mettreAJourProgression();
}

/**
 * Supprime une tâche.
 * @param {number} idTache
 */
function supprimerTodo(idTache) {
  /* Confirmer la suppression */
  if (!confirm('Supprimer cette tâche ?')) return;

  /* Supprimer de la mémoire */
  const todos = window.lireStockage(window.CLES.TODOS, []);
  const nouveauxTodos = todos.filter(t => t.id !== idTache);
  window.ecrireStockage(window.CLES.TODOS, nouveauxTodos);

  /* Supprimer de l'interface */
  const li = listeTodos.querySelector(`[data-id="${idTache}"]`);
  if (li) {
    li.remove();
  }

  /* Recalculer la progression */
  mettreAJourProgression();
}

/**
 * Charge et affiche toutes les tâches sauvegardées.
 */
function chargerTodos() {
  if (!listeTodos) return;

  const todos = window.lireStockage(window.CLES.TODOS, []);
  todos.forEach(ajouterTodoDOM);
}

/* ──────────────────────────────────────────────────────────
   5. GESTION DES HABITUDES
   ────────────────────────────────────────────────────────── */

/**
 * Charge et affiche les habitudes pour aujourd'hui.
 */
function chargerHabitudes() {
  if (!grilleHabitudes) return;

  const dateAujourdhui = new Date().toISOString().split('T')[0]; /* YYYY-MM-DD */

  /* Récupérer les habitudes cochées pour aujourd'hui */
  const habitudesSauvegardees = window.lireStockage(window.CLES.HABITUDES, {});
  const cocheesAujourdhui = habitudesSauvegardees[dateAujourdhui] || [];

  /* Créer l'interface pour chaque habitude */
  HABITUDES_PREDEFINIES.forEach(habitude => {
    /* Vérifier si l'habitude est disponible aujourd'hui selon sa fréquence */
    if (!estHabitudeDisponible(habitude, dateAujourdhui)) return;

    const div = document.createElement('div');
    div.className = 'habitude-item';
    div.dataset.id = habitude.id;

    if (cocheesAujourdhui.includes(habitude.id)) {
      div.classList.add('cochee');
    }

    div.innerHTML = `
      <div class="habitude-icone">${habitude.icone}</div>
      <div class="habitude-nom">${habitude.nom}</div>
      <div class="habitude-frequence">${habitude.frequence}</div>
    `;

    /* Brancher l'événement */
    div.addEventListener('click', () => cocherHabitude(habitude.id));

    grilleHabitudes.appendChild(div);
  });
}

/**
 * Vérifie si une habitude est disponible aujourd'hui selon sa fréquence.
 * @param {Object} habitude — l'habitude à vérifier
 * @param {string} dateAujourdhui — date au format YYYY-MM-DD
 * @returns {boolean} true si disponible
 */
function estHabitudeDisponible(habitude, dateAujourdhui) {
  const date = new Date(dateAujourdhui);
  const jour = date.getDay(); // 0 = dimanche, 1 = lundi, etc.
  const jourMois = date.getDate();
  const mois = date.getMonth();
  const annee = date.getFullYear();

  switch (habitude.frequence) {
    case 'quotidien':
      return true;

    case 'hebdomadaire':
      /* Disponible le lundi (début de semaine) */
      return jour === 1;

    case 'mensuel':
      /* Disponible le 1er du mois */
      return jourMois === 1;

    case 'annuel':
      /* Disponible le 1er janvier */
      return jourMois === 0 && jourMois === 1;

    default:
      return true;
  }
}

/**
 * Coche/décoche une habitude pour aujourd'hui.
 * @param {string} idHabitude
 */
function cocherHabitude(idHabitude) {
  const dateAujourdhui = new Date().toISOString().split('T')[0];

  /* Récupérer les données */
  const habitudesSauvegardees = window.lireStockage(window.CLES.HABITUDES, {});
  const cocheesAujourdhui = habitudesSauvegardees[dateAujourdhui] || [];

  /* Basculer l'état */
  const index = cocheesAujourdhui.indexOf(idHabitude);
  if (index > -1) {
    /* Décocher */
    cocheesAujourdhui.splice(index, 1);
  } else {
    /* Cocher */
    cocheesAujourdhui.push(idHabitude);
  }

  /* Sauvegarder */
  habitudesSauvegardees[dateAujourdhui] = cocheesAujourdhui;
  window.ecrireStockage(window.CLES.HABITUDES, habitudesSauvegardees);

  /* Mettre à jour l'interface */
  const div = grilleHabitudes.querySelector(`[data-id="${idHabitude}"]`);
  if (div) {
    div.classList.toggle('cochee');
  }

  /* Recalculer la progression */
  mettreAJourProgression();
}

/* ──────────────────────────────────────────────────────────
   6. PROGRESSION GLOBALE
   ────────────────────────────────────────────────────────── */

/**
 * Change la visibilité de la progression (public/privé).
 */
function changerVisibilite() {
  const visibilite = window.lireStockage(window.CLES.VISIBILITE, {});
  visibilite[window.AppState.prenom] = togglePublic.checked;
  window.ecrireStockage(window.CLES.VISIBILITE, visibilite);

  /* Mettre à jour le score global selon la nouvelle visibilité */
  mettreAJourProgression();
}

/**
 * Calcule et affiche la progression globale du jour.
 * Basée sur les tâches terminées + habitudes cochées.
 */
function mettreAJourProgression() {
  if (!barreProgression || !pourcentGlobal) return;

  /* Compter les tâches */
  const todos = window.lireStockage(window.CLES.TODOS, []);
  const totalTodos = todos.length;
  const todosTerminees = todos.filter(t => t.terminee).length;

  /* Compter les habitudes */
  const dateAujourdhui = new Date().toISOString().split('T')[0];
  const habitudesSauvegardees = window.lireStockage(window.CLES.HABITUDES, {});
  const cocheesAujourdhui = habitudesSauvegardees[dateAujourdhui] || [];
  const totalHabitudes = HABITUDES_PREDEFINIES.length;
  const habitudesCochees = cocheesAujourdhui.length;

  /* Calculer le pourcentage */
  const totalElements = totalTodos + totalHabitudes;
  const elementsCompletes = todosTerminees + habitudesCochees;

  let pourcentage = 0;
  if (totalElements > 0) {
    pourcentage = Math.round((elementsCompletes / totalElements) * 100);
  }

  /* Mettre à jour l'interface */
  barreProgression.style.width = `${pourcentage}%`;
  pourcentGlobal.textContent = `${pourcentage}%`;

  /* Sauvegarder le score pour le classement groupe seulement si public */
  const visibilite = window.lireStockage(window.CLES.VISIBILITE, {});
  const estPublic = visibilite[window.AppState.prenom] || false;

  if (estPublic) {
    const scores = window.lireStockage(window.CLES.SCORES, {});
    scores[window.AppState.prenom] = pourcentage;
    window.ecrireStockage(window.CLES.SCORES, scores);
  } else {
    /* Si privé, supprimer le score du classement */
    const scores = window.lireStockage(window.CLES.SCORES, {});
    delete scores[window.AppState.prenom];
    window.ecrireStockage(window.CLES.SCORES, scores);
  }
}

/**
 * Change la citation affichée de manière aléatoire.
 */
function changerCitation() {
  if (!citationElement) return;

  /* Choisir une citation aléatoire */
  const indexAleatoire = Math.floor(Math.random() * CITATIONS.length);
  const citation = CITATIONS[indexAleatoire];

  /* Mettre à jour l'affichage */
  citationElement.innerHTML = `
    "${citation.texte}"
    <cite>— ${citation.auteur}</cite>
  `;
}
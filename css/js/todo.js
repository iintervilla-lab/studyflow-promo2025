/* ═══════════════════════════════════════════════════════════
   todo.js — Logique de la page "Mon espace"
   Rôle : gérer la to-do list et les habitudes quotidiennes
   Dépend de : app.js (window.AppState, window.CLES, window.lireStockage, window.ecrireStockage)
   ═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────
   1. CONSTANTES — liste des habitudes prédéfinies
   ──────────────────────────────────────────────────────────
   Ces habitudes sont fixes et s'affichent chaque jour.
   Elles sont cochables individuellement.
────────────────────────────────────────────────────────── */
const HABITUDES_PREDEFINIES = [
  { id: 'sport', nom: 'Sport', icone: '🏃' },
  { id: 'lecture', nom: 'Lecture', icone: '📖' },
  { id: 'eau', nom: 'Boire eau', icone: '💧' },
  { id: 'sommeil', nom: 'Bien dormir', icone: '😴' },
  { id: 'repas', nom: 'Manger sain', icone: '🥗' },
  { id: 'social', nom: 'Parler proches', icone: '💬' },
];

/* ──────────────────────────────────────────────────────────
   2. ÉLÉMENTS DU DOM
   ────────────────────────────────────────────────────────── */
let inputTodo, btnAjouterTodo, listeTodos;
let grilleHabitudes;
let barreProgression, pourcentGlobal;

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

  /* Brancher les événements */
  if (btnAjouterTodo) {
    btnAjouterTodo.addEventListener('click', ajouterTodo);
  }
  if (inputTodo) {
    inputTodo.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') ajouterTodo();
    });
  }

  /* Charger les données sauvegardées */
  chargerTodos();
  chargerHabitudes();

  /* Calculer et afficher la progression */
  mettreAJourProgression();
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
    const div = document.createElement('div');
    div.className = 'habitude-item';
    div.dataset.id = habitude.id;

    if (cocheesAujourdhui.includes(habitude.id)) {
      div.classList.add('cochee');
    }

    div.innerHTML = `
      <div class="habitude-icone">${habitude.icone}</div>
      <div class="habitude-nom">${habitude.nom}</div>
    `;

    /* Brancher l'événement */
    div.addEventListener('click', () => cocherHabitude(habitude.id));

    grilleHabitudes.appendChild(div);
  });
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

  /* Sauvegarder le score pour le classement groupe */
  const scores = window.lireStockage(window.CLES.SCORES, {});
  scores[window.AppState.prenom] = pourcentage;
  window.ecrireStockage(window.CLES.SCORES, scores);
}
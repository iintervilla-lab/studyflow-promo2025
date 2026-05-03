/* ═══════════════════════════════════════════════════════════
   chat.js — Logique du chat de groupe
   Rôle : envoyer et afficher les messages en temps réel simulé
   Dépend de : app.js (window.CLES, window.lireStockage, window.ecrireStockage)
   ═══════════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────
   1. ÉLÉMENTS DU DOM
   ────────────────────────────────────────────────────────── */
let inputChat, btnEnvoyerChat, zoneMessages;

/* ──────────────────────────────────────────────────────────
   2. INITIALISATION
   ────────────────────────────────────────────────────────── */
window.initChat = function() {
  console.log('✅ Initialisation chat.js');

  /* Récupérer les éléments du DOM */
  inputChat = document.getElementById('chat-input');
  btnEnvoyerChat = document.getElementById('chat-envoyer');
  zoneMessages = document.getElementById('chat-messages');

  /* Brancher les événements */
  if (btnEnvoyerChat) {
    btnEnvoyerChat.addEventListener('click', envoyerMessage);
  }
  if (inputChat) {
    inputChat.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') envoyerMessage();
    });
  }

  /* Charger les messages sauvegardés */
  chargerMessages();

  /* Mettre à jour le badge de nouveaux messages */
  mettreAJourBadge();
};

/* ──────────────────────────────────────────────────────────
   3. GESTION DES MESSAGES
   ────────────────────────────────────────────────────────── */

/**
 * Envoie un nouveau message.
 */
function envoyerMessage() {
  if (!inputChat || !zoneMessages) return;

  const texte = inputChat.value.trim();
  if (!texte) return;

  /* Créer le message */
  const message = {
    id: Date.now(),
    texte: texte,
    auteur: window.AppState.prenom,
    date: new Date().toISOString()
  };

  /* Sauvegarder */
  const messages = window.lireStockage(window.CLES.CHAT, []);
  messages.push(message);
  window.ecrireStockage(window.CLES.CHAT, messages);

  /* Ajouter à l'interface */
  ajouterMessageDOM(message);

  /* Vider le champ */
  inputChat.value = '';

  /* Scroller vers le bas */
  scrollerBas();
}

/**
 * Ajoute un message à l'interface.
 * @param {Object} message — {id, texte, auteur, date}
 */
function ajouterMessageDOM(message) {
  if (!zoneMessages) return;

  const div = document.createElement('div');
  div.className = 'message';
  div.dataset.id = message.id;

  /* Déterminer si c'est un message de l'utilisateur actuel */
  const estMoi = message.auteur === window.AppState.prenom;
  div.classList.add(estMoi ? 'message-moi' : 'message-autre');

  /* Formater l'heure */
  const date = new Date(message.date);
  const heure = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  div.innerHTML = `
    <div class="message-meta">
      <span class="message-auteur">${estMoi ? 'Moi' : message.auteur}</span>
      <span class="message-heure">${heure}</span>
    </div>
    <p class="message-texte">${message.texte}</p>
  `;

  zoneMessages.appendChild(div);
}

/**
 * Charge et affiche tous les messages sauvegardés.
 */
function chargerMessages() {
  if (!zoneMessages) return;

  const messages = window.lireStockage(window.CLES.CHAT, []);
  messages.forEach(ajouterMessageDOM);

  /* Scroller vers le bas après chargement */
  setTimeout(scrollerBas, 100);
}

/**
 * Fait scroller la zone de messages vers le bas.
 */
function scrollerBas() {
  if (zoneMessages) {
    zoneMessages.scrollTop = zoneMessages.scrollHeight;
  }
}

/* ──────────────────────────────────────────────────────────
   4. BADGE DE NOUVEAUX MESSAGES
   ────────────────────────────────────────────────────────── */

/**
 * Met à jour le badge de nouveaux messages dans la nav.
 */
function mettreAJourBadge() {
  const badge = document.getElementById('chat-badge');
  if (!badge) return;

  /* Pour l'instant, pas de logique complexe :
     on pourrait compter les messages non lus,
     mais comme c'est localStorage partagé,
     on considère qu'il n'y a pas de "non lus" */
  badge.classList.add('cachee');
}
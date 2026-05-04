graph TD
    A[Utilisateur] --> B(Navigateur Web / WebView);
    B --> C(index.html);
    C --> D(manifest.json);
    C --> E(Service Worker sw.js);
    C --> F(Feuilles de style CSS);
    C --> G(Scripts JavaScript);

    E -- Cache les ressources statiques --> C;
    E -- Intercepte les requêtes réseau --> H(Réseau / API Backend);
    E -- Gère la synchronisation en arrière-plan --> H;
    E -- Gère les notifications Push --> A;

    F -- app.css --> C;
    F -- auth.css --> C;
    F -- todo.css --> C;
    F -- groupe.css --> C;
    F -- chat.css --> C;

    G -- app.js --> C;
    G -- auth.js --> C;
    G -- todo.js --> C;
    G -- groupe.js --> C;
    G -- chat.js --> C;
    G -- Gère la logique de l\'application --> I(Données Locales / State);
    G -- Interagit avec le Service Worker --> E;

    subgraph Pages de l\'Application
        P1(Mon espace)
        P2(Le groupe)
        P3(Chat de groupe)
    end

    C -- Affiche les pages --> P1;
    C -- Affiche les pages --> P2;
    C -- Affiche les pages --> P3;

    I -- Stockage local (ex: localStorage, IndexedDB) --> B;

    P1 -- Géré par --> G;
    P2 -- Géré par --> G;
P3 -- Géré par --> G;

    %% Interactions entre scripts
    G -- Coordination --> G;

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#ccf,stroke:#333,stroke-width:2px
    style D fill:#afa,stroke:#333,stroke-width:2px
    style E fill:#faa,stroke:#333,stroke-width:2px
    style F fill:#ddf,stroke:#333,stroke-width:2px
    style G fill:#ffc,stroke:#333,stroke-width:2px
    style H fill:#fcc,stroke:#333,stroke-width:2px
    style I fill:#cdf,stroke:#333,stroke-width:2px
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

async function readDb() {
  const content = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(content);
}

async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

const normalize = value => String(value || '').trim().toLowerCase();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
});

app.post('/api/auth/login', async (req, res) => {
  const { prenom, password } = req.body;
  if (!prenom || !password) {
    return res.status(400).json({ message: 'prenom et mot de passe requis' });
  }

  const db = await readDb();
  const user = db.users.find(u => normalize(u.prenom) === normalize(prenom));

  if (!user) {
    return res.status(401).json({ message: 'Utilisateur non trouvé' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Mot de passe invalide' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.get('/api/users/:prenom', async (req, res) => {
  const db = await readDb();
  const user = db.users.find(u => normalize(u.prenom) === normalize(req.params.prenom));

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

app.get('/api/group', async (req, res) => {
  const db = await readDb();
  res.json(db.group_data || {});
});

app.post('/api/group/tops', async (req, res) => {
  const { top } = req.body;
  if (!top || typeof top !== 'string') {
    return res.status(400).json({ message: 'Champ top requis' });
  }

  const db = await readDb();
  db.group_data.tops = db.group_data.tops || [];
  db.group_data.tops.push({ id: Date.now().toString(), text: top, createdAt: new Date().toISOString() });
  await writeDb(db);

  res.status(201).json({ message: 'Top ajouté', tops: db.group_data.tops });
});

app.post('/api/group/flops', async (req, res) => {
  const { flop } = req.body;
  if (!flop || typeof flop !== 'string') {
    return res.status(400).json({ message: 'Champ flop requis' });
  }

  const db = await readDb();
  db.group_data.flops = db.group_data.flops || [];
  db.group_data.flops.push({ id: Date.now().toString(), text: flop, createdAt: new Date().toISOString() });
  await writeDb(db);

  res.status(201).json({ message: 'Flop ajouté', flops: db.group_data.flops });
});

app.listen(PORT, () => {
  console.log(`✅ StudyFlow backend démarré sur http://localhost:${PORT}`);
});

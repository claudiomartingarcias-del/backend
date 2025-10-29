const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Middleware para verificar ID token de Firebase
async function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
  const idToken = header.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = { uid: decoded.uid, email: decoded.email };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido', detail: err.message });
  }
}

/* Endpoints mínimos (ejemplos) */

// Crear partido
app.post('/matches', authMiddleware, async (req, res) => {
  try {
    const payload = req.body;
    payload.createdBy = req.user.uid;
    payload.createdAt = admin.firestore.FieldValue.serverTimestamp();
    payload.players = payload.players || [req.user.uid];
    payload.status = 'open';
    const ref = await db.collection('matches').add(payload);
    const doc = await ref.get();
    res.status(201).json({ id: ref.id, ...doc.data() });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Listar partidos (filtros opcionales)
app.get('/matches', async (req, res) => {
  try {
    let q = db.collection('matches');
    const { level, date } = req.query;
    if (level) q = q.where('levelMin', '<=', Number(level)).where('levelMax', '>=', Number(level));
    if (date) q = q.where('date', '==', date);
    const snap = await q.limit(50).get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Unirse a partido
app.post('/matches/:id/join', authMiddleware, async (req, res) => {
  try {
    const uid = req.user.uid;
    const matchRef = db.collection('matches').doc(req.params.id);
    const matchDoc = await matchRef.get();
    if (!matchDoc.exists) return res.status(404).json({ message: 'Partido no encontrado' });
    const match = matchDoc.data();
    if (match.players && match.players.includes(uid)) return res.status(400).json({ message: 'Ya estás en el partido' });
    if (match.players && match.players.length >= match.maxPlayers) return res.status(400).json({ message: 'Partido lleno' });
    await matchRef.update({ players: admin.firestore.FieldValue.arrayUnion(uid) });
    res.json({ message: 'Te uniste al partido' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Exponer Express app como función HTTPS
exports.api = functions.https.onRequest(app);
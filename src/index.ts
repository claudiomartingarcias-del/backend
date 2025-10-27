import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa Firebase Admin.
// En desarrollo, puedes usar una Service Account local via GOOGLE_APPLICATION_CREDENTIALS (.env)
// o descomentar la opción cert si prefieres una ruta explícita.
// admin.initializeApp({
//   credential: admin.credential.cert('./serviceAccountKey.json' as any),
// });

admin.initializeApp();

app.get('/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.post('/users', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email y password son requeridos' });
    const user = await admin.auth().createUser({ email, password });
    res.json({ uid: user.uid, email: user.email });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/notes', async (req, res) => {
  try {
    const { uid, text } = req.body;
    if (!uid || !text) return res.status(400).json({ error: 'uid y text son requeridos' });
    const db = admin.firestore();
    const doc = await db.collection('notes').add({ uid, text, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    res.json({ id: doc.id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
import { Router } from 'express';
import admin from 'firebase-admin';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email y password son requeridos' });
    const user = await admin.auth().createUser({ email, password });
    res.json({ uid: user.uid, email: user.email });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
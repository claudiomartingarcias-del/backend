const { admin, db } = require('../index');

exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const user = await admin.auth().createUser({ email, password, displayName: name });
    await db.collection('users').doc(user.uid).set({
      id: user.uid,
      email,
      name,
      createdAt: new Date(),
    });
    res.json({ message: 'Usuario creado', id: user.uid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.me = async (req, res) => {
  const user = req.user;
  const doc = await db.collection('users').doc(user.uid).get();
  res.json(doc.data());
};
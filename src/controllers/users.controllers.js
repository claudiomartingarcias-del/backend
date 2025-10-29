const { db } = require('../index');

exports.listUsers = async (req, res) => {
  const snapshot = await db.collection('users').limit(20).get();
  const users = snapshot.docs.map(d => d.data());
  res.json(users);
};

exports.getUser = async (req, res) => {
  const doc = await db.collection('users').doc(req.params.id).get();
  res.json(doc.data());
};
const { db, admin } = require('../index');

exports.listMatches = async (req, res) => {
  const snapshot = await db.collection('matches').limit(20).get();
  const matches = snapshot.docs.map(d => d.data());
  res.json(matches);
};

exports.createMatch = async (req, res) => {
  const data = req.body;
  data.createdBy = req.user.uid;
  data.createdAt = admin.firestore.FieldValue.serverTimestamp();
  const ref = await db.collection('matches').add(data);
  res.json({ id: ref.id, ...data });
};
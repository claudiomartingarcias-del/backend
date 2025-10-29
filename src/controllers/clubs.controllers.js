const { db } = require('../index');

exports.listClubs = async (req, res) => {
  const snapshot = await db.collection('clubs').limit(20).get();
  const clubs = snapshot.docs.map(d => d.data());
  res.json(clubs);
};
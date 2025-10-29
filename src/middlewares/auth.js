const { admin } = require('../index');

exports.authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Falta token' });
  const token = header.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
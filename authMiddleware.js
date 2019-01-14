const jwt = require('jsonwebtoken');
const keys = require('./keys');

exports.auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res
        .status(401)
        .json({ status: 401, message: `Unathorized access` });

    let token = req.headers.authorization.split(' ')[1];
    let decoded = await jwt.verify(token, keys.secret);
    if (decoded.admin === keys.username) return next();

    return res.status(401).json({ status: 401, message: `Unathorized access` });
  } catch (e) {
    return res.status(401).json({ status: 401, message: e.message });
  }
};

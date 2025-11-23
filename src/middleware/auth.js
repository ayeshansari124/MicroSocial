const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, COOKIE_NAME } = require('../config');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      if (req.accepts('html')) return res.redirect('/login');
      return res.status(401).send('Unauthorized');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;

    req.user = await User.findById(req.userId).lean();
    if (!req.user) {
      res.clearCookie(COOKIE_NAME);
      if (req.accepts('html')) return res.redirect('/login');
      return res.status(401).send('Unauthorized');
    }

    next();
  } catch (err) {
    res.clearCookie(COOKIE_NAME);
    if (req.accepts('html')) return res.redirect('/login');
    return res.status(401).send('Unauthorized');
  }
};

module.exports = (err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);

  if (err && err.message && err.message.includes('Only image files')) {
    if (req.accepts('html')) return res.status(400).send('Only image files are allowed (max 5MB)');
    return res.status(400).json({ error: 'Only image files are allowed (max 5MB)' });
  }

  if (req.accepts('html')) {
    return res.status(500).send('Server error');
  }

  res.status(500).json({ error: 'Server error' });
};

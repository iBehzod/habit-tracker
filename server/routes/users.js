const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  res.json({ user: req.user });
});

// Other user routes

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/cases', async (req, res) => {
  const cases = await Case.find();
  res.json(cases);
});

router.post('/case', async (req, res) => {
  // Create case logic
});

module.exports = router;
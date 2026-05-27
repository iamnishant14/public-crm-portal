const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/contacts', async (req, res) => {
  const contacts = await pool.query('SELECT * FROM contacts');
  res.json(contacts.rows);
});

router.post('/contact', async (req, res) => {
  // Create contact logic
});

module.exports = router;
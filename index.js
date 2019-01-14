const express = require('express');
const jwt = require('jsonwebtoken');
const keys = require('./keys');
const { auth } = require('./authMiddleware');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const username = keys.username;
const password = keys.password;

app.post('/login', async (req, res) => {
  if (req.body.username === username && req.body.password === password) {
    const token = await jwt.sign({ admin: username }, keys.secret, {
      expiresIn: '1h'
    });
    return res.status(200).json({ status: 200, token });
  }
  return res.status(401).json({ status: 401, message: `Unauthorized access` });
});

let countries = [];

app.get('/countries', auth, (req, res) => {
  res.status(200).json({ status: 200, countries });
});

app.put('/countries', auth, (req, res) => {
  if (!req.body.country)
    return res
      .status(400)
      .json({ status: 400, message: `Key or Name expected is country` });

  countries.push(req.body.country);
  res.status(200).json({ status: 200, countries });
});

app.delete('/countries', auth, (req, res) => {
  if (!req.body.country)
    return res
      .status(400)
      .json({ status: 400, message: `Key or Name expected is country` });

  let index = countries.indexOf(req.body.country);
  if (index > -1) {
    countries.splice(index, 1);
    return res.status(200).json({ status: 200, countries });
  }
  return res.status(400).json({
    status: 400,
    message: `Country not found. It may already have been deleted`
  });
});

const port = 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

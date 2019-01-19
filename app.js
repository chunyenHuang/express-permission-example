const express = require('express');
const app = express();

const {
    tokenMiddlewares,
    authMiddlewares,
} = require('./functions');

app.get('/users?/:id', tokenMiddlewares, authMiddlewares('USET_GET'), (req, res) => {
    res.json(req.user);
});

app.delete('/users?/:id', tokenMiddlewares, authMiddlewares('USET_DELETE'), (req, res) => {
    res.send('ok');
});

module.exports = app;
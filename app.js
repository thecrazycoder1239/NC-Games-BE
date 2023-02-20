const express = require('express');
const app = express();
const { fetchCategories, invalidRoute } = require('./controllers/get-controllers');
const { handles404, handleServerErrors } = require('./error-handlers');

app.use(express.json());

app.get('/api/categories', fetchCategories);

app.get('*', invalidRoute);

app.use(handles404);
app.use(handleServerErrors);

module.exports = app;
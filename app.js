const express = require('express');
const app = express();
const { fetchCategories, fetchReviews, fetchReview, postComment, fetchComments, patchReview, fetchUsers } = require('./controllers/get-controllers');
const { handlesServerErrors, handlesInvalidPath, handles404Errors, handles400Errors } = require('./error-handlers');

app.use(express.json());

app.get('/api/categories', fetchCategories);

app.get('/api/reviews', fetchReviews);

app.get('/api/reviews/:review_id/comments', fetchComments)

app.get('/api/reviews/:review_id', fetchReview);

app.get('/api/users', fetchUsers);

app.post('/api/reviews/:review_id/comments', postComment);

app.patch('/api/reviews/:review_id', patchReview);

app.use(handlesInvalidPath);
app.use(handles404Errors);
app.use(handles400Errors);
app.use(handlesServerErrors);

module.exports = app;
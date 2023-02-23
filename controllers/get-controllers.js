const { fetchedCategories, fetchedReviews, fetchedComments, fetchedReview, selectReviewsById, postedComment, patchedReview, fetchedUsers } = require('../models/get-models');

exports.fetchCategories = (req, res, next) => {
    fetchedCategories().then(categories => {
        res.status(200).send({ categories });
    }).catch(err => {
        next(err);
    }) 
}

exports.fetchReviews = (req, res, next) => {
    fetchedReviews().then(reviews => {
        res.status(200).send({ reviews });
    }).catch(err => {
        next(err);
    })
}

exports.fetchComments = (req, res, next) => {
    const { review_id } = req.params;
    const checkForId = selectReviewsById(review_id)
    const fetchComments = fetchedComments(review_id)
    Promise.all([fetchComments, checkForId]).then(([comments]) => {
        res.status(200).send({ comments })
    }).catch(err => {
        next(err)
    })
}

exports.fetchReview = (req, res, next) => {
    const { review_id } = req.params;
    fetchedReview( review_id ).then(review => {
        res.status(200).send({ review });
    }).catch(err => {
        next(err);
    })
}

exports.patchReview = (req, res, next) => { 
    const increment = req.body.inc_votes
    const { review_id } = req.params;
    const checkForId = selectReviewsById(review_id)
    const patchedReviewPromise = patchedReview(increment, review_id)
    Promise.all([patchedReviewPromise, checkForId]).then(([updatedReview]) => {
        res.status(200).send({ updatedReview })
    }).catch(err => {
        next(err)
    })
}

exports.postComment = (req, res, next) => {
    const { body } = req
    const {review_id} = req.params
    postedComment(body, review_id).then(comment => {
        res.status(201).send({ comment })
    }).catch(err => {
        next(err)
    })
}

exports.fetchUsers = (req, res, next) => {
    fetchedUsers().then(users => {
        res.status(200).send({users})
    }).catch(err => {
        next(err)
    })
}
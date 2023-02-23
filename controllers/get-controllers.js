const { fetchedCategories, fetchedReviews, fetchedComments, fetchedReview, selectReviewsById, postedComment, patchedReview, fetchedUsers, selectCategoriesBySlug, deletedComment } = require('../models/get-models');

exports.fetchCategories = (req, res, next) => {
    fetchedCategories().then(categories => {
        res.status(200).send({ categories });
    }).catch(err => {
        next(err);
    }) 
}

exports.fetchReviews = (req, res, next) => {
    const category = req.query.category
    const sortBy = req.query.sort_by
    const orderBy = req.query.order_by
    if (category !== undefined) {
        const categoriesPromise = selectCategoriesBySlug(category)
        const reviewsPromise = fetchedReviews(category, sortBy, orderBy)
        Promise.all([reviewsPromise, categoriesPromise]).then(([reviews]) => {
            res.status(200).send({ reviews });
        }).catch(err => {
            next(err);
        })
    } else {
        fetchedReviews(category, sortBy, orderBy).then(reviews => {
            res.status(200).send({ reviews });
        }).catch(err => {
            next(err);
        })
    }
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

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    deletedComment(comment_id).then((response) => {
        res.status(204).send()
    }).catch(err => {
        next(err)
    })
}
const db = require('../db/connection');


exports.fetchedCategories = () => {
    return db.query(`SELECT * FROM categories`).then((response) => {
        return response.rows;
    })
}

exports.fetchedReviews = () => {
    return db.query(`SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY created_at DESC`).then((response) => {
        return response.rows;
    })
}

exports.fetchedComments = (review_id) => {
    return db.query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`, [ review_id ]).then(response => {
        return response.rows;
    })
}

exports.fetchedReview = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id]).then(response => {
        if (response['rows'].length === 0) {
            return Promise.reject('review not found');
        }
        return response.rows[0];
    })
}

exports.selectReviewsById = (review_id) => {
    let query = `SELECT * FROM reviews`;
    const search = [];
    if(review_id !== undefined) {
        query += ` WHERE review_id = $1`;
        search.push(review_id);
    }

    return db.query(query, search).then(response => {
        const rowCount = response.rowCount
        if(rowCount === 0) {
            return Promise.reject('review id not found')
        } else {
            return response.rows
        }
    })
} 
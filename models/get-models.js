const db = require('../db/connection');


exports.fetchedCategories = () => {
    return db.query(`SELECT * FROM categories`).then((response) => {
        return response.rows;
    })
}

exports.fetchedReviews = (category, sortBy, orderBy) => {
    let queryString = 'SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id';
    const queryParams = [];

    if(category !== undefined) {
        const categoryString = ` WHERE reviews.category = $1`;
        queryString += categoryString;
        queryParams.push(category)
    }

    const groupBy = ' GROUP BY reviews.review_id';
    queryString += groupBy;
    let sortByString = '';
    const acceptedSortBy = ['votes', 'title', 'designer', 'owner', 'review_img_url', 'review_body', 'category', 'created_at', 'votes']

    if(acceptedSortBy.includes(sortBy)) {
        sortByString += ` ORDER BY ${sortBy}`
    } else if (sortBy !== undefined) {
        return Promise.reject('sort by property not found');
    } else {
        sortByString += ' ORDER BY created_at'
    }

    queryString += sortByString;
    let orderByString = ''
    const accpetedOrderBy = ['ASC', 'DESC', 'asc', 'desc']

    if(accpetedOrderBy.includes(orderBy)) {
        orderByString += ` ${orderBy}`
    } else if(orderBy !== undefined) {
        return Promise.reject('order by argument not accepted')
    } else {
        orderByString += ' DESC'
    }

    queryString += orderByString;

    return db.query(queryString, queryParams).then((response) => {
        return response.rows;
    })
}

exports.fetchedComments = (review_id) => {
    return db.query(`SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`, [ review_id ]).then(response => {
        return response.rows;
    })
}

exports.fetchedReview = (review_id) => {
    return db.query(`SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id`, [review_id]).then(response => {
        if (response['rows'].length === 0) {
            return Promise.reject('review not found');
        }
        return response.rows[0];
    })
}

exports.postedComment = (comment, review_id) => {
    let data = [];
    data.push(comment.username)
    data.push(comment.body)
    data.push(review_id)
    
    return db.query(`INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`, data).then(response => {
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

exports.patchedReview = (increment, review_id) => {
    if(typeof increment === 'number') {
        const values = [increment, review_id];
        return db.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`, values).then(response => {
        return response.rows[0];
    })
    } else if (increment !== undefined) {
        return Promise.reject('invalid type of incriment votes')
    } else { 
    const values = [review_id];
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, values).then(response => {
        return response.rows[0];
    })
    }
}

exports.fetchedUsers = () => {
    return db.query(`SELECT * FROM users`).then(response => {
        return response.rows;
    })
}

exports.selectCategoriesBySlug = (category) => {
    return db.query(`SELECT * FROM categories WHERE slug = $1`, [category]).then(response => {
        if(response['rows'].length === 0) {
            return Promise.reject('category not found')
        } else {
            return response.rows
        }
    })
}

exports.deletedComment = (commentId) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [commentId]).then((response) => {
        if(response['rows'].length === 0) {
            return Promise.reject('comment not found')
        }
        return response.rows[0];
    })
}
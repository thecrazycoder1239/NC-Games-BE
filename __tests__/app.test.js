const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
require('jest-sorted');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/categories', () => {
    test('returns a correctly formatted array of category objects', () => {
        return request(app).get('/api/categories').expect(200).then((response) => {
            response['body']['categories'].forEach(category => {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                });
            })
        })
    });
    test('returns a category array of the correct length', () => {
        return request(app).get('/api/categories').expect(200).then((response) => {
            expect(response.body.categories).toHaveLength(4);
        })
    });
});

describe('GET /api/reviews', () => {
    test('returns a correctly formatted array of reviews objects', () => {
        return request(app).get('/api/reviews').expect(200).then((response) => {
            response['body']['reviews'].forEach(category => {
                expect(category).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                });
            })
        })
    });
    test('returns a category array of the correct length', () => {
        return request(app).get('/api/reviews').expect(200).then((response) => {
            expect(response.body.reviews).toHaveLength(13);
        })
    });
    test('returns a category array sorted by date in ascending order', () => {
        return request(app).get('/api/reviews').expect(200).then((response) => {
            const reviews = [...response.body.reviews];
            reviews.sort(function (a , b) {
                return new Date(b.created_at) - new Date(a.created_at);
              });
            expect(reviews).toEqual(response.body.reviews);
        })
    });
    describe('GET /api/reviews/:review_id/comments', () => {
        test('returns with an array of comment objects', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const arrayOfComments = response.body.comments;
                arrayOfComments.forEach(comment => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: expect.any(Number)
                    })
                })
            })
        });
        test('returns with an array of the correct length and content for the review_id', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const arrayOfComments = response.body.comments;
                expect(arrayOfComments).toHaveLength(3)
                expect(arrayOfComments[0]).toMatchObject({
                    comment_id: 6,
                    body: 'Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite',
                    review_id: 3,
                    author: 'philippaclaire9',
                    votes: 10,
                    created_at: '2021-03-27T19:49:48.110Z'
                  })
            })
        });
        test('returns with an array sorted to have the most recent comments first', () => {
            return request(app).get('/api/reviews/3/comments').expect(200).then(response => {
                const commentsCopy = [...response.body.comments];
            commentsCopy.sort(function (a , b) {
                return new Date(b.created_at) - new Date(a.created_at);
              });
            expect(commentsCopy).toEqual(response.body.comments);
            })
        });
    });
    // add advanced error handle jim showed for review_id without comments
});

describe('error handling', () => {
    test('returns 404 if route does not exist', () => {
        return request(app).get('/api/notARoute').expect(404).then((response) => {
            expect(response._body.msg).toBe('route does not exist')
        })
    });
});
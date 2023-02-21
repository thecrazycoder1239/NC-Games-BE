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
    describe('GET /api/reviews/:review_id', () => {
        test('responds with a review object', () => {
            return request(app).get('/api/reviews/1').expect(200).then((response) => {
                expect(response.body.review).toMatchObject({
                    review_id : expect.any(Number),
                    title: expect.any(String),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(String)
                })
            })
        });
        test('responds with a the specifc review object requested', () => {
            return request(app).get('/api/reviews/4').expect(200).then((response) => {
                expect(response.body).toMatchObject({ review: {
                    review_id: 4,
                    title: 'Dolor reprehenderit',
                    designer: 'Gamey McGameface',
                    owner: 'mallionaire',
                    review_img_url: 'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700',
                    review_body: 'Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod',
                    category: 'social deduction',
                    created_at: "2021-01-22T11:35:50.936Z",
                    votes: 7
                }})
            })
        });
    });
});

describe('error handling', () => {
    test('returns 404 if path is not found', () => {
        return request(app).get('/api/notARoute').expect(404).then((response) => {
            expect(response._body.msg).toBe('path not found')
        })
    });
    test('returns a 400 if review_id is invalid', () => {
        return request(app).get('/api/reviews/banana').expect(400).then((response) => {
            expect(response._body.msg).toBe('review id invalid')
        })
    });
    test('returns a 404 if review_id is out of range', () => {
        return request(app).get('/api/reviews/999').expect(404).then((response) => {
            expect(response._body.msg).toBe('review not found')
        })
    });
});
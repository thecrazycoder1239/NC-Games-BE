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
            console.log(reviews)
            expect(reviews).toBeSortedBy('created_at', {
                ascending: true,
                coerce: true
            });
        })
    });
});

describe('error handling', () => {
    test('returns 404 if route does not exist', () => {
        return request(app).get('/api/notARoute').expect(404).then((response) => {
            expect(response._body.msg).toBe('route does not exist')
        })
    });
});
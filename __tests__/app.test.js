const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/categories', () => {
    test('returns a correctly formatted category object', () => {
        return request(app).get('/api/categories').expect(200).then((response) => {
            response['body']['categories'].forEach(category => {
                expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                });
            })
        })
    });
    test('returns a category object of the correct length', () => {
        return request(app).get('/api/categories').expect(200).then((response) => {
            expect(response.body.categories).toHaveLength(4);
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